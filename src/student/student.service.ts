import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StudentService {

  constructor(
    @InjectRepository(Student)
    private studentORM: Repository<Student>
  ) { }

  async findOne(scorm: string) {
    try {
      const result = await this.studentORM.findBy({ scorm })
      console.log('result', result)
    } catch (error) {
      throw new BadRequestException('No se encontro el registro')
    }
  }

  update(id: number, updateStudentDto: UpdateStudentDto) {
    console.log('updateStudentDto', updateStudentDto)
    return `This action updates a #${id} student`;
  }

  remove(id: number) {
    return `This action removes a #${id} student`;
  }
}
