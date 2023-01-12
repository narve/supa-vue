import {RouteRecordRaw} from "vue-router";
import DataTypes from "../api/DataTypes.vue";

const name = 'participation'
const title = 'Deltagersystem'
const routes = <RouteRecordRaw[]>[
    {
        path: '/'+name,
        component: DataTypes,
        props: {dataTypes: ['participant_statistics', 'participant']},
    },
]

export default {
    name,
    title,
    routes,
}