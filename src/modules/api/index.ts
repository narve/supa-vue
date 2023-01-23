import {RouteRecordRaw} from "vue-router";
import DataTypes from "./DataTypes.vue";
import DataComponentPage from "./DataComponentPage.vue";

const name = 'api'
const title = 'API'
const routes: RouteRecordRaw[] = [
    {
        name: 'api',
        path: '/api',
        component: DataTypes,
    },
    {
        path: '/api/:name',
        component: DataComponentPage,
    }
]
export default {
    name,
    title,
    routes,
}

