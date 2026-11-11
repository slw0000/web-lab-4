export interface ApiErrorDetail {
    fieldName: string
    message: string
}

export interface ApiErrorResponse {
    message: string
    details: ApiErrorDetail[]
}
