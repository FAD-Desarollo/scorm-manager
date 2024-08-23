import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Scorm {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    folder: string;

    @Column()
    fileName: string;

    @Column()
    link: string;

    @CreateDateColumn()
    creationDate: Date;

    @Column()
    status: boolean

    @Column({ nullable: true  })
    typeScorm: string
}
