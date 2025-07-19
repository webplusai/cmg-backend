import { applyDecorators, Type } from "@nestjs/common";
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from "@nestjs/swagger";
import { PaginatedDto } from "../type.definitions";

interface IPaginatedDecoratorApiResponse {
  model: Type<unknown>;
  description?: string;
}

export const ApiPaginatedResponse = (
  options: IPaginatedDecoratorApiResponse,
) => {
  return applyDecorators(
    ApiExtraModels(PaginatedDto),
    ApiOkResponse({
      description: options.description || "Successfully received model list",
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginatedDto) },
          {
            properties: {
              items: {
                type: "array",
                items: { $ref: getSchemaPath(options.model) },
              },
              meta: {
                type: "any",
                default: {
                  totalItems: 2,
                  itemCount: 2,
                  itemsPerPage: 2,
                  totalPages: 1,
                  currentPage: 1,
                },
              },
            },
          },
        ],
      },
    }),
  );
};
