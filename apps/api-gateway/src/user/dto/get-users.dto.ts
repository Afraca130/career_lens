import { IsOptional, IsNumber, IsString, Min, Max } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class GetUsersDto {
  @ApiProperty({ example: 1, description: "페이지 번호", required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    example: 10,
    description: "페이지당 항목 수",
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiProperty({ example: "홍길동", description: "검색어", required: false })
  @IsOptional()
  @IsString()
  search?: string = "";
}
