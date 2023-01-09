import {RouteRecordRaw} from "vue-router";
import OrderLine from "./OrderLine.vue";

const name = 'bee'
const title = 'Bee'


const routes = <RouteRecordRaw[]>[
    {
        name: 'bee',
        path: '/bee',
        component: OrderLine,
        children: [
            // {
            //     path: 'students',
            //     component: Students,
            // },
            // {
            //     path: 'student/:id',
            //     component: Student,
            // },
            // {
            //     path: 'Questions',
            //     component: Questions,
            // },
            // {
            //     path: 'Report',
            //     component: Report,
            // },
        ]

    },
    // {
    //     name: 'students',
    //     path: '/grades/students',
    //     component: Students
    // },
]

export default {
    name,
    title,
    routes,
}