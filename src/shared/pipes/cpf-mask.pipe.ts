import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'cpfMask',
    standalone: true
})
export class CpfMaskPipe implements PipeTransform {
    transform(value: string): string {
        if (!value) return '';

        const cleaned = value.replace(/\D/g, '');
        if (cleaned.length !== 11) return value;

        return `${cleaned.substring(0, 3)}.XXX.XXX-${cleaned.substring(9, 11)}`;
    }
}