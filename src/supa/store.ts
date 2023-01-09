import { reactive } from "vue"
import {Session} from '@supabase/supabase-js';
import { supabase } from './index';

export const store = reactive({
    session: null as Session | null,
})

supabase.auth.onAuthStateChange((_, session) => {
    store.session = session
})
