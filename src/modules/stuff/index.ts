import {RouteRecordRaw} from "vue-router";
import DataTypes from "../api/DataTypes.vue";

const name = 'stuff'
const title = 'Stuff that moves'
const routes = <RouteRecordRaw[]>[
    {
        path: '/'+name,
        component: DataTypes,
        props: {dataTypes: ['location', 'item']},
    },
]

export default {
    name,
    title,
    routes,
}