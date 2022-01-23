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


