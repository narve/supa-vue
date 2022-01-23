import {createApp} from 'vue'
import App from './App.vue'
import {createRouter, createWebHistory, RouterOptions} from 'vue-router';
import HelloWorld from './components/HelloWorld.vue';
import AboutComponent from './components/AboutComponent.vue';
import HomeComponent from './components/HomeComponent.vue';
import SupaConfig from './components/SupaConfig.vue';
import AuthComponent from './components/AuthComponent.vue';

console.log("Name: ", AboutComponent.name);
console.log("AuthComponent name: ", AuthComponent.name);
console.log("AuthComponent: ", AuthComponent);

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
        ...components.map(sc => ToRoute(sc)), 
        {
            path: "/",
            name: HomeComponent.name,
            component: HomeComponent,
        },
    ], history: createWebHistory()
};

const app = createApp(App);
app.use(createRouter(myRoutes));
app.mount('#app')

