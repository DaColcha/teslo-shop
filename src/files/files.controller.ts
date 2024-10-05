import { BadRequestException, Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter, fileNamer} from './helpers';
import { diskStorage } from 'multer';
import e from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('files')
export class FilesController {
  constructor(

    private readonly filesService: FilesService,

    private readonly configService: ConfigService
  
  ) {}

  @Post('product')
  @UseInterceptors( FileInterceptor('file',
    { fileFilter: fileFilter,
      storage: diskStorage({ 
        destination: './static/products',
        filename: fileNamer
       })
    }
  ) )
  uploadFile(
    @UploadedFile() file: Express.Multer.File 
  ) {

    if(!file) {
      throw new BadRequestException("Make sure that the file is an image");
    }

    const secureURL = `${ this.configService.get('HOST_API')}/files/product/${file.filename}`;

    return secureURL;
  }

  @Get('product/:imageName')
  findOneFile(
    @Param('imageName') imageName: string,
    @Res() res: e.Response){

    const path = this.filesService.getStaticProductImage(imageName);
    
    res.sendFile( path );

  }
}
