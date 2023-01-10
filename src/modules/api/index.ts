import {RouteRecordRaw} from "vue-router";
import DataTypes from "./DataTypes.vue";
import DataComponent from "./DataComponent.vue";

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
        component: DataComponent,
    }
]
export default {
    name,
    title,
    routes,
}