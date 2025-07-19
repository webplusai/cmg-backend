import { HttpStatus, ValidationPipe } from '@nestjs/common';

export const REGEX = {
  PASSWORD_RULE:
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
};

const VALIDATION_PIPE = new ValidationPipe({
  errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
});

export const VALIDATION_ERROR_MESSAGES = {
  RECORD_NOT_FOUND: 'Record not found.',
  RECORD_ALREADY_EXISTS: 'Record already exists.',
  RECORD_NOT_UPDATED:
    'Record not updated. Looks like you are trying to update with same data.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  PASSWORD_REGEX:
    'Password should have 1 upper case, lowercase letter along with a number and special character.',
  ALLOWED_REG_ROLES: 'Roles must be an one of the allowed registration roles',
};

export const APP_SETTINGS = {
  VALIDATION_PIPE,
  VALIDATION_ERROR_MESSAGES,
};

export enum USER_ROLES {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER',
}

export enum ALLOWED_REG_ROLES {
  CUSTOMER = USER_ROLES.CUSTOMER,
}

export enum STATUS {
  CANCELLED = 'cancelled',
  RESERVED = 'reserved',
  PAID_50PERCENT = 'paid_50%',
  PAID_100PERCENT = 'paid_100%',
  OPEN = 'open'
}