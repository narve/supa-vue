import {
    SupabaseClient
} from '@supabase/supabase-js';
import {OpenApiData} from './SupaTypes';

const log = (...args: any[]) => {
    // console.debug("[oapi]", ...args);
};

export const getOpenApi = async (client: SupabaseClient) => {
    const {data, error} = await client.from("").select('*');
    if (data) {
        const typedData = data as unknown as OpenApiData;
        processOpenApi(typedData);
        return typedData;
    } else {
        console.error('OpenAPI Fetching failed: ', error);
        throw error;
    }
}


export const titleProps = ['title', 'handle', 'name', 'email', 'id'];

// @ts-ignore
export const processOpenApi = ({definitions}) => {
    log('Processing OpenAPI: ', definitions);

    for (const tableName in definitions) {
        log(' Processing ', tableName);
        const table = definitions[tableName];

        // Find the title property of the table:
        table.titleProp = titleProps.find(p => !!table.properties[p]);
        log('  title prop for ', tableName, table.titleProp, ' available: ', Object.keys(table.properties));
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
                prop.fk.fk_name = [tableName, propName, "fkey"].join("_");
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


/// REFACTORING:


export interface KVP {
    name: string;
    value: any;
}

export const toKVP = (obj: any): { name: string, value: any }[] => Object.keys(obj)
    .map(k => ({name: k, value: obj[k]}));


//
// export const titleColumn = (tab, id) => {
//     const remoteTable = template.data.definitions[tab];
// }
