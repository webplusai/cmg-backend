// file-upload.service.ts
import { Injectable, BadRequestException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { v2 as cloudinary } from "cloudinary";
import * as fs from "fs";
import * as util from "util";

@Injectable()
export class FileUploadService {
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>("cloudinary.cloudName"),
      api_key: this.configService.get<string>("cloudinary.apiKey"),
      api_secret: this.configService.get<string>("cloudinary.apiSecret"),
    });
  }

  async uploadFile(fileBuffer: Buffer): Promise<string> {
    try {
      const writeFile = util.promisify(fs.writeFile);
      const tempFilePath = "/tmp/temp-file"; // You can customize the temporary file path

      // Write the file buffer to a temporary file
      await writeFile(tempFilePath, fileBuffer);

      // Upload the temporary file to Cloudinary
      const result = await cloudinary.uploader.upload(tempFilePath, {
        resource_type: "auto", // You can specify the resource type (image, video, raw, auto, etc.)
      });

      return result.secure_url;
    } catch (error) {
      throw new BadRequestException("Failed to upload the file");
    }
  }

  async deleteFile(url: string): Promise<void> {
    const getImage = url.split("/").pop();
    const id = getImage?.split(".")[0]

    if (!id) throw new Error("Could not delete null image");

    const result = await cloudinary.uploader.destroy(id)

    return result;
  }
}
