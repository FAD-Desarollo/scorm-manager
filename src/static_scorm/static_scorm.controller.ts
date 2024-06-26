import { Controller, Get } from '@nestjs/common';
import { join } from 'path';
import { readFileSync } from 'fs'

@Controller('')
export class StaticScormController {
  constructor() { }
  
  @Get('')
  index() {
    return this.renderStatic('listScorm');
  }

  @Get('zip')
  uploadZip() {
    return this.renderStatic('upload');
  }

  @Get('list')
  findAll() {
    return this.renderStatic('listScorm');
  }

  @Get('view')
  viewScorm() {
    return this.renderStatic('viewScorm');
  }

  renderStatic(html: string = 'index') {
    const filePath = join(__dirname, '..', '..', 'public/scorm', `${html}.html`);
    const fileContent = readFileSync(filePath, 'utf8');
    return fileContent;
  }
}
