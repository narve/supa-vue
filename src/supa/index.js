// noinspection SpellCheckingInspection

import {createClient} from '@supabase/supabase-js';


const log = (...args) => console.debug("[oapi]", ...args);

export const getActiveConfig = () => ({
    name: "narve",
    base_url: "https://xupzhicrqmyvtgztrmjb.supabase.co",
    client_key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYxMDExNjg5NCwiZXhwIjoxOTI1NjkyODk0fQ.cvK8Il2IbFqU03Q4uOhSQ9jxFkWELLACX7mJKyy_Ue0',
});

const getClient = () => {
    const config = getActiveConfig();
    return createClient(config.base_url, config.client_key);
};

export const supabase = getClient()


const getOpenApi = async () => {
    const {data, error} = await getClient().from("").select('*');
    if (data) {
        processOpenApi(data);
        return data;
    } else {
        console.error('OpenAPI Fetching failed: ', error);
        throw error;
    }
}


export const titleProps = ['title', 'handle', 'name', 'id'];

// @ts-ignore
export const processOpenApi = ({definitions}) => {
    log('Processing OpenAPI: ', definitions);

    for (const tableName in definitions) {
        log(' Processing ', tableName);
        const table = definitions[tableName];

        // Find the title property of the table:
        table.titleProp = titleProps.find(p => !!table.properties[p]);
        log('  title prop for ', tableName, table.titleProp);
    }


    // For each column, extract database-properties:
    // And set property name! 
    for (const tableName in definitions) {
        log(' Processing ', tableName);
        const table = definitions[tableName];

        for (const propName in table.properties) {
            log('   ', propName);
            const prop = table.properties[propName];
            prop.name = propName;
            prop.isPk = prop.description?.indexOf("<pk") >= 0;
            prop.isFk = prop.description?.indexOf("<fk") >= 0;
            if (prop.isFk) {
                const [, table, column] = [...prop.description.matchAll(/.*<fk table='(.*)' column='(.*)'.*/g)]
                    [0];
                prop.fk = {table, column, select: definitions[table].titleProp};
            }
        }
    }
};

// @ts-ignore
export const colVal = col => {
    if (!col) return "";
    if (typeof col === "object") {
        const s = col['title'] || col['name'] || col['handle'] || col['id'];
        // return html`<a href="the-ref">${s}</a>`; 
        return s;
    }
    return col;
};

//
// export const titleColumn = (tab, id) => {
//     const remoteTable = template.data.definitions[tab];
// }
