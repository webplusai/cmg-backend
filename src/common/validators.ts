import {
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';
import {
  ALLOWED_REG_ROLES,
  VALIDATION_ERROR_MESSAGES,
} from './constants/app.utils';

@ValidatorConstraint({ name: 'allowedRegRoles', async: false })
export class AllowedRegRolesValidator implements ValidatorConstraintInterface {
  validate(value: ALLOWED_REG_ROLES) {
    if (typeof value !== 'string') {
      return false;
    }

    if (!Object.values(ALLOWED_REG_ROLES).includes(value)) {
      return false;
    }

    return true;
  }

  defaultMessage() {
    return VALIDATION_ERROR_MESSAGES.ALLOWED_REG_ROLES;
  }
}
