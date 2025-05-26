import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { CreateFarmDto } from 'src/farm/dto/create-farm.dto';
import { UpdateFarmDto } from 'src/farm/dto/update-farm.dto';

@ValidatorConstraint({ name: 'isValidAreaSum', async: false })
export class IsValidAreaSumConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const obj = args.object as CreateFarmDto | UpdateFarmDto; // Objeto sendo validado
    const cultivableArea = obj.cultivableArea;
    const vegetationArea = obj.vegetationArea;
    const totalArea = obj.totalArea;

    if (
      typeof cultivableArea !== 'number' ||
      typeof vegetationArea !== 'number' ||
      typeof totalArea !== 'number'
    ) {
      return true;
    }

    return cultivableArea + vegetationArea <= totalArea;
  }

  defaultMessage(args: ValidationArguments) {
    return 'The sum of cultivable area and vegetation area must be less than or equal to the total area';
  }
}
