import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query } from '@nestjs/common';
import { StudentService } from './student.service';
import { UpdateStudentDto } from './dto/update-student.dto';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) { }

  // @Get()
  // findAll() {
  //   return this.studentService.findAll();
  // }

  @Get()
  async findOne(@Query() query: any) {
    return this.studentService.findOne(query?.scorm)
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentService.update(+id, updateStudentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentService.remove(+id);
  }
}
