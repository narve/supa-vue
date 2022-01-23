import {createApp} from 'vue'
import App from './App.vue'
import {createRouter, createWebHistory, RouterOptions} from 'vue-router';
import AboutComponent from './components/About.vue';
import HomeComponent from './components/Home.vue';
import SupaConfig from './components/SupaConfig.vue';
import AuthComponent from './components/Auth.vue';

import "./assets/main.css"

interface SmartComponent {
    name: string;
    path: string;
    aliases?: string;
}

const components: SmartComponent[] = [
    HomeComponent, AboutComponent, SupaConfig, AuthComponent,
];

const ToRoute = (sc: SmartComponent) => ({
    name: sc.name,
    path: sc.path,
    aliases: sc.aliases,
    component: sc,
});


const myRoutes: RouterOptions = {
    routes: [
        {
            path: "/",
            name: HomeComponent.name,
            component: HomeComponent,
        },
        ...components.map(sc => ToRoute(sc)), 
    ], history: createWebHistory()
};

const app = createApp(App);
app.use(createRouter(myRoutes));
app.mount('#app')

