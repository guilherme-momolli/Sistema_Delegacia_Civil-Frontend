import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { InqueritoPolicial } from '../inquerito-policial/inquerito-policial.service';

@Injectable({
  providedIn: 'root'
})
export class RelatorioService {

  constructor() {}

  gerarRelatorioInqueritos(inqueritos: InqueritoPolicial[]) {
    const doc = new jsPDF();

    // Título
    doc.setFontSize(18);
    doc.text('Relatório de Inquéritos Policiais', 14, 22);

    // Data da geração
    const dataAtual = new Date().toLocaleString();
    doc.setFontSize(10);
    doc.text(`Gerado em: ${dataAtual}`, 14, 30);

    // Cabeçalhos da tabela
    const colunas = [
      'ID',
      'Número Justiça',
      'Ordem IP',
      'Data',
      'Peça',
      'Relator',
      'Investigado',
      'Vítima',
      'Delito',
      'Situação'
    ];

    // Dados da tabela
    const dados = inqueritos.map(inq => [
      inq.id || '',
      inq.numeroJustica || '',
      inq.ordemIp || '',
      inq.data ? new Date(inq.data).toLocaleDateString() : '',
      inq.peca || '',
      inq.relator || '',
      inq.investigado || '',
      inq.vitima || '',
      inq.naturezaDoDelito || '',
      inq.situacaoInquerito || ''
    ]);

    
    autoTable(doc, {
      startY: 40,
      head: [colunas],
      body: dados,
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [52, 58, 64], textColor: 255 },
      alternateRowStyles: { fillColor: [240, 240, 240] } 
    });

    
    doc.save('relatorio_inqueritos.pdf');
  }
}
