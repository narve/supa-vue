import {RouteRecordRaw} from "vue-router";
import DataTypes from "../api/DataTypes.vue";

const name = 'musicschool'
const title = 'Music school system'
const routes = <RouteRecordRaw[]>[
    {
        path: '/'+name,
        component: DataTypes,
        props: {dataTypes: ['lyrics', 'course', 'employment', 'teacher', 'student', 'enrollment', 'assignment']},
    },
]

export default {
    name,
    title,
    routes,
}