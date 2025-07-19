// file-upload.controller.ts
import { Controller, Post, Body, BadRequestException } from "@nestjs/common";
import { FileUploadService } from "./file-upload.service";

@Controller("file")
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post("upload")
  async uploadFile(@Body() fileBuffer: Buffer): Promise<{ url: string }> {
    try {
      const url = await this.fileUploadService.uploadFile(fileBuffer);
      return { url };
    } catch (error) {
      throw new BadRequestException("Failed to upload the file");
    }
  }
}
