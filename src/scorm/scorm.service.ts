import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';

import { createWriteStream, createReadStream, readFile, writeFile, statSync, readdirSync, existsSync } from 'fs';
import * as path from 'path';
import * as unzipper from 'unzipper';
import { promisify } from 'util';
import { Scorm } from './entities/scorm.entity';
import { Repository } from 'typeorm';

enum TypeScorm {
  RISE = 'rise_articulate',
  OTHER = 'otro'
}

@Injectable()
export class ScormService {

  constructor(
    private configService: ConfigService,
    @InjectRepository(Scorm)
    private scormORM: Repository<Scorm>
  ) { }

  async uploadFile(file, typeScorm) {
    try {
      const uploadPath = path.join(__dirname, '..', '..', 'uploads', file.originalname);
      await new Promise<void>((resolve, reject) => {
        const writeStream = createWriteStream(uploadPath);
        writeStream.write(file.buffer);
        writeStream.on('finish', resolve);
        writeStream.on('error', reject);
        writeStream.end();
      });
      const extractPath = path.join(__dirname, '..', '..', 'files');
      // Descomprimir el paquete SCORM
      const nameScorm = await this.unziped(uploadPath, extractPath)
      // Agregar el script personalizado
       // Datos para guardar en la DB
      const baseUrl = this.configService.get<string>('BASE_URL')
      let link = `${baseUrl}/files/${nameScorm}`
      let routeScorm = `${extractPath}/${nameScorm}`
      if (typeScorm === TypeScorm.RISE) {
        link = link + '/scormcontent/'
        routeScorm = routeScorm + '/scormcontent/index.html'
        await this.addScript(routeScorm, nameScorm)
      }
      
      const body = {
        fileName: file.originalname,
        folder: nameScorm,
        link: link,
        status: true,
        typeScorm: typeScorm as string
      }
      // Creo registro en la DB
      return await this.scormORM.save(body)
    } catch (error) {
      console.log('Error:', error)
      throw new Error()
    }
  }

  async unziped(uploadPath: string, extractPath: string): Promise<string> {
    try {
      // Obtener el nombre del archivo sin la extensión
      const zipName = path.parse(uploadPath).name;
      const targetPath = path.join(extractPath, zipName);
  
      // Descomprimir en la carpeta con el mismo nombre que el ZIP
      await new Promise<void>((resolve, reject) => {
        createReadStream(uploadPath)
          .pipe(unzipper.Extract({ path: targetPath }))
          .on('close', resolve)
          .on('error', reject);
      });
  
      return zipName; // Retornar el nombre de la carpeta que se utilizó para descomprimir
    } catch (error) {
      console.error('Error al descomprimir el zip', error);
      throw new Error(error.message);
    }
  }

  async getAll() {
    try {
      return await this.scormORM.find()
    } catch (error) {
      console.error('Error al obtener archivos:', error);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      this.scormORM.delete(id)
    } catch (error) {
      console.error('Error al eliminar:', error);
      throw error;
    }
  }

  async addScript(filePath: string, nameScorm): Promise<boolean> {
    const readFileAsync = promisify(readFile);
    const writeFileAsync = promisify(writeFile);
    try {
      let data = await readFileAsync(filePath, 'utf8');
      data = data.replace('</title>', '</title>\n    <script src="https://rise-scorm-cdn.pages.dev/main.js"></script>');
      data = data.replace('finishQuiz(passed, score, id) {', `finishQuiz(passed, score, id) {\n  sendDataAcropolis(score)`)
      data = data.replace(`console.log('Warning: Course was unable to find the LMS API for ' + funcName + '. Course may have been launched from scormcontent/index.html, or the course package is not within an LMS. Saving of student data will not occur.');`, `console.info("INFO: Scorm cargado en Acropolis")`)
      // data = data.replace(`async function __loadJsonp(id, path) {`, `async function __loadJsonp(id, path) {\n  
      //   const title = "${nameScorm}";\n  
      //   const request = await fetch("http://localhost:3000/student/?scorm=" + title);
      //   const student = await request.json();
      //   if(student?.statusCode !== 200){
      //     const request = fetch("http://localhost:3000/student/" + window?.scormParams?.id, { method: "PUT", body: JSON.stringify({
      //       progress: "";
      //       qualification: null;
      //       scorm: "${nameScorm}";
      //       url: "";
      //   }) })
      //   }
      //   else {
      //     console.log("Setear en window")
      //   }
      // `)
      await writeFileAsync(filePath, data, 'utf8');
      return true;
    } catch (err) {
      console.error('Error al agregar logica al scorm', err);
      throw new Error(String(err));
    }
  }
}
