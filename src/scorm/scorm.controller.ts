import { Controller, Get, InternalServerErrorException, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ScormService } from './scorm.service';

@Controller('scorm')
export class ScormController {
  constructor(private readonly scormService: ScormService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file) {
    try {
      return await this.scormService.uploadFile(file)
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  @Get()
  async findAll() {
    return await this.scormService.getAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.scormService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateScormDto: UpdateScormDto) {
  //   return this.scormService.update(+id, updateScormDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.scormService.remove(+id);
  // }
}
