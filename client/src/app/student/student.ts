export interface Student {
    _id: string;
    lastname: string;
    firstname: string;
    email: string;
    projects: string[];
    skills: any[];
    password: string;
    role: 'student' | 'teacher' | 'admin';
}
