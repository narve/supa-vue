import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory, RouterOptions } from 'vue-router';
import AboutComponent from './components/About.vue';
import SupaConfig from './components/SupaConfig.vue';
import AuthComponent from './components/Auth.vue';
import DataComponent from './components/DataComponent.vue';
import PasswordRecovery from './components/PasswordRecovery.vue';
import OrderLine from "./components/OrderLine.vue";
import DataTypes from "./components/DataTypes.vue";
import {supabase} from "./supa";

// import "./assets/main.css"

// interface SmartComponent {
// 	name: string;
// 	path: string;
// 	alias?: string;
// }
//
// const components: SmartComponent[] = [
// 	AboutComponent, SupaConfig, AuthComponent
// ];
//
// const ToRoute = (sc: SmartComponent) => ({
// 	name: sc.name,
// 	path: sc.path,
// 	// alias: sc.alias,
// 	component: sc,
// });


const myRoutes: RouterOptions = {
	routes: [
		{
			path: "/",
			alias: "/home",
			name: "home",
			// name: HomeComponent.name,
			// component: HomeComponent,
			component: OrderLine,
			
		},
		{
			path: "/api",
			name: "data-types",
			component: DataTypes,
		},
		{
			path: "/auth",
			name: "auth",
			// alias: "/home",
			// name: HomeComponent.name,
			// component: HomeComponent,
			component: AuthComponent,
		},
		{
			path: "/api/:name",
			// name: 'show-data',
			component: DataComponent,
		},
		{
			path: "/password-recovery",
			name: "password-recovery",
			component: PasswordRecovery,
		},
		// ...components.map(sc => ToRoute(sc)),
	], history: createWebHistory()
};

const app = createApp(App);
const router = createRouter(myRoutes);
router.beforeEach(async (to, from, next) => {
	const isAuthenticated = !!await supabase.auth.user()?.id;
	if (to.name !== 'auth' && !isAuthenticated) next({ name: 'auth' })
	else next()
})

app.use(router);
app.mount('#app')

