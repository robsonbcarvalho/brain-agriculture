import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { cpf, cnpj } from 'cpf-cnpj-validator';

@ValidatorConstraint({ name: 'isCpfCnpj', async: false })
export class IsCpfCnpjConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    if (typeof value !== 'string') {
      return false;
    }

    const cleanedValue = value.replace(/[^\d]+/g, '');

    return cpf.isValid(cleanedValue) || cnpj.isValid(cleanedValue);
  }

  defaultMessage(args: ValidationArguments) {
    return '$property must be a valid CPF or CNPJ';
  }
}
