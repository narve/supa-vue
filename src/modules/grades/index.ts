import {RouteRecordRaw} from "vue-router";
import GradeHome from "./GradeHome.vue";
import Students from "./students.vue";
import Questions from "./questions.vue";
import Report from "./report.vue";
import Answers from "./answers.vue";
import DataComponent from "../api/DataComponent.vue";

const name = 'grades'
const title = 'Grades'

const routes = <RouteRecordRaw[]>[
    {
        name: 'grades',
        path: '/grades',
        component: GradeHome,
        children: [
            {
                path: 'students',
                component: Students,
            },
            // {
            //     path: 'questionnaires',
            //     component: DataComponent,
            //     props: []
            // },
            {
                path: 'answers',
                component: Answers,
            },
            {
                path: 'questionnaires',
                component: DataComponent,
                props: {
                    tableName: 'questionnaire',
                    links: (o:any) => [
                        {href: `questions/${o.id}`, title:'Spørsmål'},
                        {href: `report/${o.id}`, title:'Oversikt'},
                    ]
                }
            },
            {
                path: 'questions/:questionnaire_id',
                component: Questions,
            },
            {
                path: 'report/:questionnaire_id',
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
export default {
    name,
    title,
    routes,
}