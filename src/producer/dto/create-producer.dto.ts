import { IsNotEmpty, IsString, MaxLength, Validate } from 'class-validator';
import { IsCpfCnpjConstraint } from '../../validators/cpf-cnpj.validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProducerDto {
  @ApiProperty({
    description: 'Producer CPF or CNPJ',
    maxLength: 20,
    example: '012.345.678-90',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  @Validate(IsCpfCnpjConstraint)
  cpfCnpj: string;

  @ApiProperty({
    description: 'Producer name',
    maxLength: 255,
    example: 'John Calvache',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;
}
