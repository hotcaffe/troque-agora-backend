import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint({name: 'birthday', async: false})
export class BirthdayConstraint implements ValidatorConstraintInterface {
    validate(value: Date, validationArguments?: ValidationArguments): boolean {
        const today = new Date();
        today.setFullYear(today.getFullYear() - 18);
        today.setDate(today.getDate() - 1);
        const dateValue = new Date(value);
        const isLegalAged = (dateValue.getTime() <= today.getTime());
        return isLegalAged;
    }

    defaultMessage(validationArguments?: ValidationArguments): string {
        const today = new Date();
        today.setFullYear(today.getFullYear() - 18);

        return `O usuário deve ter nascido antes de ${today.toLocaleDateString('pt-BR')}!`
    }
}