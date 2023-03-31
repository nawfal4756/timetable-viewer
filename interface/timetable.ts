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