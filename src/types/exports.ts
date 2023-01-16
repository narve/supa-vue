import {supabase} from "../supa";
import {Database} from "./index";
import {PostgrestError} from "@supabase/supabase-js";

export function getOrThrow<T>({data, error}: { data: T[] | null, error: PostgrestError | null }): T[] {
    if (error)
        throw Error(error.message)
    else
        return data!
}

export async function getStudents() {
    return supabase.from('student').select();
}
export async function getQuestions() {
    return supabase.from('question').select();
}
export async function getAnswers() {
    return supabase.from('answer').select();
}
// export async function insertAnswers(x) {
//     return supabase.from('answer').insert(x);
// }


// export type ArrayElement<ArrayType extends readonly unknown[]> =
//     ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export type ArrayElement<A> = A extends readonly (infer T)[] ? T : never

export type StudentsResponse = Awaited<ReturnType<typeof getStudents>>
export type StudentsResponseSuccess = StudentsResponse['data']
export type StudentsResponseError = StudentsResponse['error']
export type StudentsRow = ArrayElement<StudentsResponseSuccess>

export type QuestionsResponse = Awaited<ReturnType<typeof getQuestions>>
export type QuestionsResponseSuccess = QuestionsResponse['data']
export type QuestionsRow = ArrayElement<QuestionsResponseSuccess>

export type AnswersInsert = Database['public']['Tables']['answer']['Insert']
export type AnswersUpdate = Database['public']['Tables']['answer']['Update']
export type AnswersRow = Database['public']['Tables']['answer']['Row']





// export type StudentsResponseRow = ArrayElement<NonNullable<StudentsResponseSuccess>>
