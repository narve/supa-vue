import { reactive } from "vue"
import { User } from '@supabase/supabase-js';
import { supabase } from './index';

export const store = reactive({
    user: null as User | null,
})

supabase.auth.onAuthStateChange((_, session) => {
    store.user = session?.user || null
})
