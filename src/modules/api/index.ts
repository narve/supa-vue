import {RouteRecordRaw} from "vue-router";
import DataTypes from "../../components/DataTypes.vue";

const name = 'api'
const title = 'API'
const routes: RouteRecordRaw[] = [
    {
        name: 'api',
        path: '/api',
        component: DataTypes,
    }
]
export default {
    name,
    title,
    routes,
}