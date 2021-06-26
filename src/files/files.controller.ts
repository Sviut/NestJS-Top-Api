import {
  Controller,
  HttpCode,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { JwtAuthGuards } from '../auth/guards/jwt.guards'
import { FileElementResponse } from './dto/file-element.response'
import { FilesService } from './files.service'
import { MFile } from './mfile.class'

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @HttpCode(200)
  @UseGuards(JwtAuthGuards)
  @UseInterceptors(FileInterceptor('files'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<FileElementResponse[]> {
    const saveArray: MFile[] = [new MFile(file)]
    if (file.mimetype.includes('image')) {
      const buffer = await this.filesService.convertToWebP(file.buffer)
      const webPFileName = `${file.originalname.split('.')[0]}.webp`
      saveArray.push(
        new MFile({
          originalname: webPFileName,
          buffer,
        }),
      )
    }
    return this.filesService.saveFiles(saveArray)
  }
}
