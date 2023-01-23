import {RouteRecordRaw} from "vue-router";
import GradeHome from "./GradeHome.vue";
import Questions from "./questions-dead.vue";
import Report from "./report.vue";
import Answers from "./answers.vue";
import DataComponent from "../api/DataComponent.vue";
import QuestionAsRow from "./question-as-rows.vue";

const name = 'grades'
const title = 'Grades'

const routes = <RouteRecordRaw[]>[
    {
        name: 'grades',
        path: '/grades',
        // redirect: '/grades/questionnaires',
        component: GradeHome,
        children: [
            {
                path: 'students',
                name: 'students',
                // component: Students,
                component: DataComponent,
                props: {
                    tableName: 'student',
                }
            },
            // {
            //     path: 'answers',
            //     component: Answers,
            // },
            {
                path: 'questionnaires',
                name: 'questionnaires',
                component: DataComponent,
                props: {
                    tableName: 'questionnaire',
                    links: (o: any) => [
                        {href: `/api/question?questionnaire_id=${o.id}`, title: 'Spørsmål (API)'},
                        {href: `questions?questionnaire_id=${o.id}`, title: 'Spørsmål'},
                        {href: `report?questionnaire_id=${o.id}`, title: 'Oversikt'},
                        {href: `questionnaire-table?questionnaire_id=${o.id}`, title: 'Tabellvisning'},
                    ]
                }
            },
            {
                path: 'questions',
                component: Questions,
            },
            {
                path: 'report',
                component: Report,
            },
            {
                path: 'questionnaire-table',
                component: QuestionAsRow,
            },
        ]

    },
]
export default {
    name,
    title,
    routes,
}