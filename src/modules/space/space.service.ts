import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LessThanOrEqual, MoreThanOrEqual, Repository } from "typeorm";
import * as fs from 'fs';
import * as fastCsv from 'fast-csv';
import axios from "axios"
import { QueryConfig } from "src/common/type.definitions";
import { Space } from "./dto/space.entity";
import { RecordNotFoundException } from "src/common/exceptions/systemErrors.exceptions";
import { VALIDATION_ERROR_MESSAGES } from "src/common/constants/app.utils";
import { SpaceDto } from "./dto/space.dto";
import { FileUploadService } from "../file-upload/file-upload.service";
import { Reservation } from "../reservation/dto/reservation.entity";
import { IPaginationOptions, Pagination, paginate } from "nestjs-typeorm-paginate";
import moment from "moment";
import { NotFoundError } from "rxjs";

@Injectable()
export class SpaceService {
  constructor(
    @InjectRepository(Space)
    private spaceRepository: Repository<Space>,
    @InjectRepository(Reservation) private reservationRepository: Repository<Reservation>,
    private fileUploadService: FileUploadService,
  ) { }

  async findAll(
    query,
    options: IPaginationOptions = {
      page: 1,
      limit: 10,
    }): Promise<Pagination<Space>> {
    const queryBuilder = this.spaceRepository.createQueryBuilder();

    return paginate<Space>(queryBuilder, options);
  }

  async findAllNoPagination(query: {
    square_meters: number;
    createdAt: string
  }): Promise<Space[]> {
    if (query.square_meters && query.createdAt) {
      return this.spaceRepository.find({
        where: {
          square_meters: MoreThanOrEqual(query.square_meters),
          created_at: MoreThanOrEqual(moment(query.createdAt, "dd-MM-yyyy").toDate())
        },
      })
    } else if (query.square_meters) {
      return this.spaceRepository.find({
        where: {
          square_meters: MoreThanOrEqual(query.square_meters)
        },
      })
    } else if (query.createdAt) {
      return this.spaceRepository.find({
        where: {
          created_at: MoreThanOrEqual(moment(query.createdAt, "dd-MM-yyyy").toDate())
        },
      })
    } else {
      return this.spaceRepository.find()
    }
  }

  async exportSpaces(spaces) {
    const csvStream = fastCsv.format({ headers: true });

    const csvFilePath = 'spaces.csv';
    const writableStream = fs.createWriteStream(csvFilePath);

    return new Promise((resolve, reject) => {
      csvStream
        .pipe(writableStream)
        .on('finish', () => resolve(csvFilePath))
        .on('error', (error) => reject(error));

      spaces.forEach((space) => {
        csvStream.write(space);
      });

      csvStream.end();
    });
  }

  async getExports(res, query) {
    let spaces: any[] = []

    if (query?.ids) {
      const ids = query?.ids.split(',');

      for (let i = 0; i < ids.length; i++) {
        const spacesByID: any = await this.spaceRepository.find({
          where: {
            id: ids[i]
          }
        });

        spaces = [...spacesByID, ...spaces]
      }
    } else {
      spaces = await this.spaceRepository.find();
    }

    const csvFilePath = await this.exportSpaces(spaces);

    res.download(csvFilePath);
  }

  async findOne(
    query?: Pick<QueryConfig, "where"> & {
      select?: (keyof Space)[];
    },
  ): Promise<Space> {
    const data = await this.spaceRepository.findOne({
      where: query?.where,
      select: query?.select,
    });

    if (!data) {
      throw new RecordNotFoundException(
        VALIDATION_ERROR_MESSAGES.RECORD_NOT_FOUND,
      );
    }

    return data;
  }

  async create(space: SpaceDto, images): Promise<Space> {
    const uploadPromises: string[] = [];

    for (const image of images) {
      uploadPromises.push(await this.fileUploadService.uploadFile(image.buffer));
    }

    const resolved = await Promise.all(uploadPromises);
    const updatedSpace = {
      ...space,
      images: resolved.join(','),
      square_meters: Number(space.square_meters),
      price: Number(space.price),
    };

    const newRecord = this.spaceRepository.create(updatedSpace);

    return await newRecord.save();
  }


  async update(id: number, space: Space, images): Promise<Space | null> {
    let updatePayload = { ...space }
    const uploadPromises: string[] = [];

    for (const image of images) {
      uploadPromises.push(await this.fileUploadService.uploadFile(image.buffer));
    }

    const resolved = await Promise.all(uploadPromises);
    const currentSpace = await this.spaceRepository.findOne({ where: { id } });

    if (resolved.length > 0) {
      const url = resolved.join(',');
      updatePayload = { ...updatePayload, images: url }
    }

    await this.spaceRepository.update(id, { ...updatePayload, images: (currentSpace?.images && currentSpace?.images.length > 0) ? `${currentSpace?.images},${updatePayload.images}` : updatePayload.images });
    return this.spaceRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<{ [key: string]: string }> {
    await this.spaceRepository.delete(id);

    return {
      message: "Space deleted successfully",
    };
  }

  async removeImage(body: { id: number, url: string }): Promise<{ [key: string]: string }> {
    let imagesArray = [] as string[];
    const space = await this.spaceRepository.findOne({ where: { id: body.id } });

    if (space?.images && space?.images.length > 0) {
      imagesArray = space?.images?.split(',');
      imagesArray.splice(imagesArray.indexOf(body.url), 1);

      await this.fileUploadService.deleteFile(body.url);
    }

    await this.spaceRepository.update(body.id, { ...space, images: imagesArray.join(',') });
    return {
      message: "Image deleted successfully",
    };
  }

  async getLocation(location: string): Promise<any> {
    try {
      const response = await axios.get(`${process.env.MAP_API_URL}?query=${location}&key=${process.env.MAP_API_KEY}`)

      return response.data;
    } catch (err) {
      throw new BadRequestException(err);
    }
  }
}
