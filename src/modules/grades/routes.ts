import {RouteRecordRaw} from "vue-router";
import GradeHome from "./GradeHome.vue";
import Students from "./students.vue";
import Questions from "./questions.vue";
import Report from "./report.vue";

export default <RouteRecordRaw[]>[
    {
        name: 'grades',
        path: '/grades',
        component: GradeHome,
        children: [
            {
                path: 'students',
                component: Students,
            },
            {
                path: 'Questions',
                component: Questions,
            },
            {
                path: 'Report',
                component: Report,
            },
        ]

    },
    {
        name: 'students',
        path: '/grades/students',
        component: Students
    },
]