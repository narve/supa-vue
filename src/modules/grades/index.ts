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
        component: GradeHome,
        children: [
            {
                path: 'students',
                // component: Students,
                component: DataComponent,
                props: {
                    tableName: 'student',
                }
            },
            {
                path: 'answers',
                component: Answers,
            },
            {
                path: 'questionnaires',
                component: DataComponent,
                props: {
                    tableName: 'questionnaire',
                    links: (o: any) => [
                        {href: `/api/question?questionnaire_id=${o.id}`, title: 'Spørsmål (API)'},
                        {href: `questions?questionnaire_id=${o.id}`, title: 'Spørsmål'},
                        {href: `report?questionnaire_id=${o.id}`, title: 'Oversikt'},
                        {href: `questions-as-rows?questionnaire_id=${o.id}`, title: 'Tabellvisning'},
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
                path: 'questions-as-rows',
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