import { HttpException, HttpStatus } from '@nestjs/common';

export class ModelNotFoundException extends HttpException {
    constructor(message: string) {
        super(message, HttpStatus.NOT_FOUND);
    }
}
export class ModelUnprocessableEnitityException extends HttpException {
    constructor(message: string) {
        super(message, HttpStatus.UNPROCESSABLE_ENTITY);
    }

}
export class ModelConflictException extends HttpException {
    constructor(message: string) {
        super(message, HttpStatus.CONFLICT);
    }

}
