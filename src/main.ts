import {createApp} from 'vue'
import App from './App.vue'
import {createRouter, createWebHistory, RouterOptions} from 'vue-router';
import AboutComponent from './components/About.vue';
import HomeComponent from './components/Home.vue';
import SupaConfig from './components/SupaConfig.vue';
import AuthComponent from './components/Auth.vue';
import DataComponent from './components/DataComponent.vue';
import PasswordRecovery from './components/PasswordRecovery.vue';
import OrderLine from "./components/OrderLine.vue";

// import "./assets/main.css"

interface SmartComponent {
    name: string;
    path: string;
    alias?: string;
}

const components: SmartComponent[] = [
    AboutComponent, SupaConfig, AuthComponent, OrderLine
];

const ToRoute = (sc: SmartComponent) => ({
    name: sc.name,
    path: sc.path,
    // alias: sc.alias,
    component: sc,
});


const myRoutes: RouterOptions = {
    routes: [
        {
            path: "/",
            // alias: "/home",
            name: HomeComponent.name,
            component: HomeComponent,
        },
        {
            path: "/show/:name",
            // name: 'show-data', 
            component: DataComponent,
        },
        {
            path: "/password-recovery",
            name: "password-recovery", 
            component: PasswordRecovery,
        },
        ...components.map(sc => ToRoute(sc)), 
    ], history: createWebHistory()
};

const app = createApp(App);
app.use(createRouter(myRoutes));
app.mount('#app')

