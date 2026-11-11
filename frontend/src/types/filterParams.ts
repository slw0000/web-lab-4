export type StudentSortField =
    | 'id'
    | 'name'
    | 'surname'
    | 'patronymic'
    | 'group'
    | 'isuId'
    | 'dormitoryNumber'
    | 'room'
    | 'moveInDate'
    | 'foreigner';

export type SortOrder = 'up' | 'down';

export interface StudentFiltersParams {
    surname?: string;
    name?: string;
    patronymic?: string;
    isuId?: string;
    group?: string[];
    dormitoryNumber?: number[];
    room?: number[];
    moveInDateFrom?: string;
    moveInDateTo?: string;
    foreigner?: boolean;
    sortBy: StudentSortField;
    order: SortOrder;
}

export interface StudentsQuery extends StudentFiltersParams {
    page: number;
    limit: number;
}

export interface StudentFilterForm {
    surname: string;
    name: string;
    patronymic: string;
    isuId: string;
    groups: string;
    dormitories: string;
    rooms: string;
    moveInDateFrom: string;
    moveInDateTo: string;
    isForeigner: '' | 'true' | 'false';
    sortBy: StudentSortField;
    order: SortOrder;
}
