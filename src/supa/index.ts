// noinspection SpellCheckingInspection

import { createClient } from '@supabase/supabase-js';
import {OpenApi, RelationRef} from "./openapi-def";
import {Database} from "../types";

export const getFatSelect = (openApi: OpenApi, tableName: string) => {
	const table:RelationRef = openApi.definitions[tableName];
	const fksToLoad = Object.values(table?.properties ?? {})
		.filter(prop => prop.isFk)
		.filter(prop => prop.name != 'owner_id')

	let select = "*";
	for (const fkProp of fksToLoad) {
		// select += `, ${fk.fk.table}!${fk.name} ( id, ${fk.fk.select} )`;
		// select += `, ${fk.fk.table}!${fk.fk.fk_name} ( id, ${fk.fk.select} )`;
		select += `, ${fkProp.fk.fk_name} ( id, ${fkProp.fk.select} )`;
	}

	return select
}


export const activeSupabaseConfig = Object.freeze({
	name: "narve",
	base_url: "https://xupzhicrqmyvtgztrmjb.supabase.co",
	client_key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYxMDExNjg5NCwiZXhwIjoxOTI1NjkyODk0fQ.cvK8Il2IbFqU03Q4uOhSQ9jxFkWELLACX7mJKyy_Ue0',
});

const getClient = () => createClient<Database>(activeSupabaseConfig.base_url, activeSupabaseConfig.client_key);

export const supabase = getClient()

// export const fetchDataAsync = async (client: SupabaseClient, tableName: keyof Definitions) => {
//
// 	console.log('table: ', tableName)
//
// 	const openApi:OpenApi = await getOpenApi(supabase)
// 	const select = getFatSelect(openApi, tableName)
//
// 	console.log('using select: ', select);
// 	const { data, error } = await getClient().from(tableName).select(select);
// 	console.log('got data: ', { data, error });
//
// 	if (error) throw error;
// 	else return { openApi, meta: openApi.definitions[tableName], data };
// }
