export interface TimetableObject {
    slots: string[];
    classes: {
        subject: string;
        section: string;
        slot: number;
        room: string;
        teacher: string;
    }[];
}

export interface SubjectSection {
    subject: string;
    section: string;
    teacher: string;
    id: number;
}

export interface Classes {
    subject: string;
    section: string;
    slot: number;
    room: string;
    teacher: string;
} 