import { IsCpfCnpjConstraint } from './cpf-cnpj.validator';
import { ValidationArguments } from 'class-validator';

describe('IsCpfCnpjConstraint', () => {
  let validator: IsCpfCnpjConstraint;

  beforeEach(() => {
    validator = new IsCpfCnpjConstraint();
  });

  it('should be defined', () => {
    expect(validator).toBeDefined();
  });

  describe('validate', () => {
    it('should return true for a valid CPF', () => {
      expect(
        validator.validate('512.342.040-10', {} as ValidationArguments),
      ).toBe(true);
      expect(validator.validate('51234204010', {} as ValidationArguments)).toBe(
        true,
      ); // Sem formatação
    });

    it('should return true for a valid CNPJ', () => {
      expect(
        validator.validate('56.777.431/0001-13', {} as ValidationArguments),
      ).toBe(true);
      expect(
        validator.validate('56777431000113', {} as ValidationArguments),
      ).toBe(true); // Sem formatação
    });

    it('should return false for an invalid CPF', () => {
      expect(
        validator.validate('111.111.111-11', {} as ValidationArguments),
      ).toBe(false);
    });

    it('should return false for an invalid CNPJ', () => {
      expect(
        validator.validate('11.111.111/0001-11', {} as ValidationArguments),
      ).toBe(false);
    });

    it('should return false for a non-string value', () => {
      expect(validator.validate(12345, {} as ValidationArguments)).toBe(false);
      expect(validator.validate(null, {} as ValidationArguments)).toBe(false);
      expect(validator.validate(undefined, {} as ValidationArguments)).toBe(
        false,
      );
    });
  });

  describe('defaultMessage', () => {
    it('should return the default message', () => {
      expect(
        validator.defaultMessage({
          property: 'cpfCnpj',
        } as ValidationArguments),
      ).toBe('$property must be a valid CPF or CNPJ');
    });
  });
});
