export declare abstract class DomainException extends Error {
    readonly cause?: Error;
    abstract readonly code: string;
    constructor(message: string, cause?: Error);
}
