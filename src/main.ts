import {createApp} from 'vue'
import App from './App.vue'
import {createRouter, createWebHistory, RouterOptions} from 'vue-router';

import AuthComponent from './components/Auth.vue';
import HomeComponent from "./components/Home.vue";
import {supabase} from "./supa";

import GradeModule from './modules/grades'
import BeeModule from './modules/bee'
import StuffModule from './modules/stuff'
import GenericModule from './modules/api'
import DataComponent from "./modules/api/DataComponent.vue";
import MusicSchool from "./modules/musicschool";

export const modules = [GradeModule, BeeModule, StuffModule, GenericModule, MusicSchool]


const myRoutes: RouterOptions = {
    routes: [
        {
            alias: "/",
            path: "/home",
            name: HomeComponent.name,
            component: HomeComponent,
        },
        {
            path: "/auth",
            name: "auth",
            component: AuthComponent,
        },
        {
            path: "/api/:name",
            // name: 'show-data',
            component: DataComponent,
        },
    ], history: createWebHistory()
};

const app = createApp(App);
export const router = createRouter(myRoutes);


modules.forEach(m => m.routes.forEach(r => router.addRoute(r)))

router.beforeEach(async (to, from, next) => {
    const isAuthenticated = !!(await supabase.auth.getSession())?.data?.session?.user;
    if (to.name !== 'auth' && !isAuthenticated) next({name: 'auth'})
    else next()
})

app.use(router);
app.mount('#app')

