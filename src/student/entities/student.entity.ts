import { Column, CreateDateColumn, PrimaryGeneratedColumn } from "typeorm";

export class Student {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    student: string;

    @Column()
    scorm: string;

    @Column()
    url: string;

    @Column()
    progress: string;

    @Column()
    qualification: boolean

    @CreateDateColumn()
    updateDate: Date;
}
