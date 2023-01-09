import routes from './routes'
import store from './store'

// import {createRouter} from "vue-router";
import {router} from "../../main";
import {RouteRecordRaw} from "vue-router";


export default {
    name: 'Grades',
    routes: routes,
    store: store,
    actions: {
        // initialize ({ dispatch }) {
        //     console.info('System initializing...')
        //     console.info('System initialized.')
        // },
        initializeModule ( module: {routes: RouteRecordRaw[]}) {
            // Store.registerModule(module.name, module.store)
            module.routes.forEach(r=>router.addRoute(r))
            // dispatch(module.name + '/initialize', null, { root: true })
        }
    }
}