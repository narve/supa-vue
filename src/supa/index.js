// noinspection SpellCheckingInspection

import {createClient} from '@supabase/supabase-js';
import {getOpenApi} from "./supa-openapi";


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

export const fetchDataAsync = async (client, tableName) => {
    console.log('table: ', tableName);

    const openApi = await getOpenApi(supabase);
// noinspection JSUnresolvedVariable
    const table = openApi.definitions[tableName];

// noinspection JSUnresolvedVariable
    const fksToLoad = Object.values(table.properties)
        .filter(prop => prop.isFk);

    let select = "*";
    for (const fk of fksToLoad) {
        // select += `, ${fk.fk.table}!${fk.name} ( id, ${fk.fk.select} )`;
        // select += `, ${fk.fk.table}!${fk.fk.fk_name} ( id, ${fk.fk.select} )`;
        select += `, ${fk.fk.fk_name} ( id, ${fk.fk.select} )`;
    }
    // select += ', school!school_id (id, name)';
    // select += ', enrollment_school_id_fkey (id, name)';
    console.log('using select: ', select);

    const {data, error} = await getClient().from(tableName).select(select);
    

    console.log('got data: ', {data, error});

    if (error) throw error;
    else return {meta: openApi.definitions[tableName], data};
}
