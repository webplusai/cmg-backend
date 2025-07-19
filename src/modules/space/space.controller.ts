import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { AnyFilesInterceptor, FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { Space } from "./dto/space.entity";
import { SpaceService } from "./space.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Roles } from "../auth/roles.decorator";
import { USER_ROLES } from "src/common/constants/app.utils";
import { Pagination } from "nestjs-typeorm-paginate";
import { query } from "express";

@Controller("spaces")
export class SpaceController {
  constructor(private spaceService: SpaceService) { }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Query() query): Promise<Pagination<Space>> {
    return this.spaceService.findAll(query, { page: query.page, limit: query.limit });
  }

  @Get('all')
  async findAllNoPaginate(
    @Query() query
  ): Promise<Space[]> {
    return this.spaceService.findAllNoPagination(query);
  }

  @Get("export-csv")
  async exportCsv(
    @Res() res,
    @Query() query
  ): Promise<void> {
    return this.spaceService.getExports(res, query);
  }

  @Get("location")
  async getLocation(
    @Query() query
  ): Promise<any> {
    return this.spaceService.getLocation(query.location);
  }

  @Get(":id")
  async findOne(@Param("id") id: number): Promise<Space> {
    return this.spaceService.findOne({ where: { id } });
  }

  @UseGuards(JwtAuthGuard)
  @Roles(USER_ROLES.ADMIN)
  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  async create(@UploadedFiles() files, @Body() spaceDto): Promise<Space> {
    return this.spaceService.create(spaceDto, files);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(USER_ROLES.ADMIN)
  @Post("remove-image")
  async removeImage(@Body() body): Promise<{ [key: string]: string }> {
    return this.spaceService.removeImage(body);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(USER_ROLES.ADMIN)
  @Put(":id")
  @UseInterceptors(AnyFilesInterceptor())
  async update(
    @Param("id") id: number,
    @UploadedFiles() files,
    @Body() space: Space,
  ): Promise<Space | null> {
    return this.spaceService.update(id, space, files);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(USER_ROLES.ADMIN)
  @Delete(":id")
  async remove(@Param("id") id: number): Promise<{ [key: string]: string }> {
    return this.spaceService.remove(id);
  }
}
