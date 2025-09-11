import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";

@ApiTags("Health")
@Controller("health")
export class HealthController {
  @Get()
  @ApiOperation({
    summary: "헬스 체크",
    description: "API 게이트웨이의 상태를 확인합니다.",
  })
  @ApiResponse({
    status: 200,
    description: "서비스가 정상적으로 작동 중입니다.",
    schema: {
      example: {
        status: "ok",
        timestamp: "2024-01-01T00:00:00.000Z",
        uptime: 12345,
        service: "api-gateway",
      },
    },
  })
  getHealth() {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      service: "api-gateway",
    };
  }

  @Get("ready")
  @ApiOperation({
    summary: "레디니스 체크",
    description: "서비스가 요청을 처리할 준비가 되었는지 확인합니다.",
  })
  @ApiResponse({
    status: 200,
    description: "서비스가 요청을 처리할 준비가 되었습니다.",
  })
  getReadiness() {
    return {
      status: "ready",
      timestamp: new Date().toISOString(),
      service: "api-gateway",
    };
  }
}
