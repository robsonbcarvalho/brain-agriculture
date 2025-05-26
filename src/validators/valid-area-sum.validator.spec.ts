import { IsValidAreaSumConstraint } from './valid-area-sum.validator';
import { ValidationArguments } from 'class-validator';
import { CreateFarmDto } from '../farm/dto/create-farm.dto';
import { UpdateFarmDto } from '../farm/dto/update-farm.dto';

describe('IsValidAreaSumConstraint', () => {
  let validator: IsValidAreaSumConstraint;

  beforeEach(() => {
    validator = new IsValidAreaSumConstraint();
  });

  it('should be defined', () => {
    expect(validator).toBeDefined();
  });

  describe('validate', () => {
    it('should return true when the sum of cultivableArea and vegetationArea is less than or equal to totalArea', () => {
      const createFarmDto: CreateFarmDto = {
        name: 'Test Farm',
        totalArea: 100,
        cultivableArea: 40,
        vegetationArea: 60,
        producerId: 1,
        cityId: 1,
      };
      expect(
        validator.validate(null, {
          object: createFarmDto,
        } as ValidationArguments),
      ).toBe(true);

      const updateFarmDto: UpdateFarmDto = {
        totalArea: 100,
        cultivableArea: 40,
        vegetationArea: 60,
      };
      expect(
        validator.validate(null, {
          object: updateFarmDto,
        } as ValidationArguments),
      ).toBe(true);
    });

    it('should return false when the sum of cultivableArea and vegetationArea is greater than totalArea', () => {
      const createFarmDto: CreateFarmDto = {
        name: 'Test Farm',
        totalArea: 100,
        cultivableArea: 60,
        vegetationArea: 50,
        producerId: 1,
        cityId: 1,
      };
      expect(
        validator.validate(null, {
          object: createFarmDto,
        } as ValidationArguments),
      ).toBe(false);

      const updateFarmDto: UpdateFarmDto = {
        totalArea: 100,
        cultivableArea: 60,
        vegetationArea: 50,
      };
      expect(
        validator.validate(null, {
          object: updateFarmDto,
        } as ValidationArguments),
      ).toBe(false);
    });

    it('should return true if any of the area values are not numbers, leaving validation to the other decorators', () => {
      type TestFarmDto = Omit<CreateFarmDto, 'totalArea'> & {
        totalArea: string;
      };

      const createFarmDto: TestFarmDto = {
        name: 'Test Farm',
        totalArea: 'abc',
        cultivableArea: 40,
        vegetationArea: 60,
        producerId: 1,
        cityId: 1,
      };

      const data: ValidationArguments = {
        object: createFarmDto,
      } as ValidationArguments;

      expect(validator.validate(null, data)).toBe(true);
    });
  });

  describe('defaultMessage', () => {
    it('should return the default message', () => {
      expect(
        validator.defaultMessage({
          property: 'totalArea',
        } as ValidationArguments),
      ).toBe(
        'The sum of cultivable area and vegetation area must be less than or equal to the total area',
      );
    });
  });
});
