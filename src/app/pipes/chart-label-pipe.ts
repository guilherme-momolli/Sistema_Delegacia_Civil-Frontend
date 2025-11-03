import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'chartLabel',
  standalone: true
})
export class ChartLabelPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    const labels: Record<string, string> = {
      VEICULO: 'Veículo',
      ARMA: 'Arma de Fogo',
      DROGA: 'Droga',
      OBJETO: 'Objeto',
      PESSOA: 'Pessoa'
    };
    return labels[value.toUpperCase()] || value;
  }
}
