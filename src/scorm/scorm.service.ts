import { Injectable } from '@nestjs/common';

import { createWriteStream, createReadStream, readFile, writeFile, statSync, readdirSync } from 'fs';
import * as path from 'path';
import * as unzipper from 'unzipper';
import { promisify } from 'util';

@Injectable()
export class ScormService {
  async uploadFile(file) {
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
      const routeScorm = `${extractPath}/${nameScorm}/scormcontent/index.html`
      const addScript = await this.addScript(routeScorm)

      return {
        addScript: addScript,
        nameScorm: nameScorm,
        nameZIP: file.originalname
      };
    } catch (error) {
      console.log('error', error)
      throw new Error()
    }
  }

  async unziped(uploadPath: string, extractPath: string): Promise<string> {
    try {
      await new Promise<void>((resolve, reject) => {
        createReadStream(uploadPath)
          .pipe(unzipper.Extract({ path: extractPath }))
          .on('close', resolve)
          .on('error', reject);
      });

      // List the directories inside the extractPath
      const folders = readdirSync(extractPath).filter((file) => {
        return statSync(path.join(extractPath, file)).isDirectory();
      });

      if (folders.length > 0) {
        return folders[0]; // Return the first folder found
      } else {
        throw new Error('No folders found in the extracted path');
      }
    } catch (error) {
      console.log('error', error);
      throw new Error(error.message);
    }
  }

  async getAll() {
    try {
      const extractPath = path.join(__dirname, '..', '..', 'files');
      const files = readdirSync(extractPath);
      return files.map(item => ({
        url: `http://localhost:3000/files/${item}/scormcontent/`, // URL base de tu servidor NestJS
        folder: item,
      }));
    } catch (error) {
      console.error('Error al obtener archivos:', error);
      throw error;
    }
  }

  async addScript(filePath: string): Promise<boolean> {
    const readFileAsync = promisify(readFile);
    const writeFileAsync = promisify(writeFile);
    try {
      let data = await readFileAsync(filePath, 'utf8');
      data = data.replace('</title>', '</title>\n    <script src="https://rise-scorm-cdn.pages.dev/main.js"></script>');
      data = data.replace('finishQuiz(passed, score, id) {', `finishQuiz(passed, score, id) {\n  sendDataAcropolis(score)`)
      data = data.replace(`console.log('Warning: Course was unable to find the LMS API for ' + funcName + '. Course may have been launched from scormcontent/index.html, or the course package is not within an LMS. Saving of student data will not occur.');`, `console.info("INFO: Scorm cargado en Acropolis")`)
      console.log('data', data)
      await writeFileAsync(filePath, data, 'utf8');

      return true;
    } catch (err) {
      console.error('Error:', err);
      throw new Error(String(err));
    }
  }
}
