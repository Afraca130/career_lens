import { ExceptionFilter, ArgumentsHost } from "@nestjs/common";
import { DomainException } from "../../domain/common/exceptions/domain.exception";
export declare class DomainExceptionFilter implements ExceptionFilter {
    private readonly logger;
    catch(exception: DomainException, host: ArgumentsHost): void;
    private mapExceptionToHttpResponse;
}
