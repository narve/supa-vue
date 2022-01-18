import {createApp} from 'vue'
import App from './App.vue'
import {createRouter, createWebHistory, RouterOptions} from 'vue-router';
import HelloWorld from './components/HelloWorld.vue';

const myRoutes: RouterOptions = {
    routes: [
        {
            name: "Home",
            path: "/",
            component: HelloWorld,
        }
    ], history: createWebHistory()
};

const app = createApp(App);
app.use(createRouter(myRoutes));
app.mount('#app')

