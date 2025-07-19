import { HttpException, HttpStatus } from '@nestjs/common';

export class RecordNotFoundException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.NOT_FOUND);
  }
}

export class SystemErrorException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export class BadRequestException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}

export class UnauthorizedException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}

export class ForbiddenException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.FORBIDDEN);
  }
}

export class ConflictException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.CONFLICT);
  }
}

export class UnprocessableEntityException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.UNPROCESSABLE_ENTITY);
  }
}

export class NotImplementedException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.NOT_IMPLEMENTED);
  }
}

export class ServiceUnavailableException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.SERVICE_UNAVAILABLE);
  }
}

export class GatewayTimeoutException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.GATEWAY_TIMEOUT);
  }
}

export class BadGatewayException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.BAD_GATEWAY);
  }
}

export class TooManyRequestsException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.TOO_MANY_REQUESTS);
  }
}

export class PayloadTooLargeException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.PAYLOAD_TOO_LARGE);
  }
}

export class RequestTimeoutException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.REQUEST_TIMEOUT);
  }
}
