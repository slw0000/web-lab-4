export interface Student {
    id: number
    name: string
    surname: string
    patronymic: string | null
    group: string
    isuId: string
    dormitoryNumber: number | null
    room: number | null
    moveInDate: string | null
    foreigner: boolean
    notes: string | null
}

export interface StudentsPage {
    message: string
    studentsCount: number
    totalPages?: number | null
    page?: number | null
    limit?: number | null
    students: Student[]
}

export interface StudentResponse {
    message: string
    id: number
    student: Student
}
