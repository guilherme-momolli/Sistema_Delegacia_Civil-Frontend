// import { Injectable } from '@angular/core';
// import { jsPDF } from 'jspdf';
// import autoTable from 'jspdf-autotable';
// import { InqueritoPolicial, InqueritoPolicialService } from '../inquerito-policial/inquerito-policial.service';

// @Injectable({ providedIn: 'root' })
// export class RelatorioService {

//   constructor(private inqueritoService: InqueritoPolicialService) {
    
//    }

//   gerarRelatorioInqueritos(inqueritos: InqueritoPolicial[]) {
//     const doc = new jsPDF();

//     doc.setFontSize(18);
//     doc.text('Relatório de Inquéritos Policiais', doc.internal.pageSize.getWidth() / 2, 22, { align: 'center' });

//     const dataAtual = new Date().toLocaleString('pt-BR', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//     doc.setFontSize(10);
//     doc.text(`Gerado em: ${dataAtual}`, 14, 30);

//     const colunas = [
//       'ID', 'Número Justiça', 'Ordem IP', 'Data', 'Peça',
//       'Relator', 'Investigado', 'Vítima', 'Delito', 'Situação'
//     ];

//     const dados = inqueritos.map(inq => [
//       inq.id ?? '',
//       inq.numeroJustica ?? '',
//       inq.ordemIp ?? '',
//       inq.data ? new Date(inq.data).toLocaleDateString() : '',
//       inq.peca ?? '',
//       inq.relator ?? '',
//       inq.investigado ?? '',
//       inq.vitima ?? '',
//       inq.naturezaDoDelito ?? '',
//       inq.situacao ?? ''
//     ]);

//     const totalPagesExp = '{total_pages_count_string}';

//     autoTable(doc, {
//       startY: 45,
//       head: [colunas],
//       body: dados,
//       styles: { fontSize: 8, cellPadding: 2 },
//       headStyles: { fillColor: [52, 58, 64], textColor: 255 },
//       alternateRowStyles: { fillColor: [240, 240, 240] },
//       didDrawPage: (data) => {
//         const pageStr = `Página ${(doc as any).internal.getNumberOfPages()} de ${totalPagesExp}`;
//         doc.setFontSize(10);
//         doc.text(pageStr, data.settings.margin.left, (doc as any).internal.pageSize.height - 10);
//       }
//     });

//     if (typeof (doc as any).putTotalPages === 'function') {
//       (doc as any).putTotalPages(totalPagesExp);
//     }

//     doc.save('relatorio_inqueritos.pdf');
//   }

//   gerarRelatorioIndividual(inqueritoId: number | null): void {
//     if (inqueritoId == null) {
//       console.warn('ID do inquérito é nulo.');
//       return;
//     }

//     this.inqueritoService.getInqueritoById(inqueritoId).subscribe({
//       next: (inquerito: InqueritoPolicial) => {
//         this.gerarPDFIndividual(inquerito);
//       },
//       error: err => {
//         console.error('Erro ao buscar inquérito:', err);
//       }
//     });
//   }

//   private gerarPDFIndividual(inquerito: InqueritoPolicial): void {
//     const doc = new jsPDF();

//     doc.setFontSize(16);
//     doc.text('Relatório Individual do Inquérito Policial', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });

//     const dataAtual = new Date().toLocaleString('pt-BR', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//     doc.setFontSize(10);
//     doc.text(`Gerado em: ${dataAtual}`, 14, 28);

//     doc.setFontSize(12);
//     doc.text('Informações do Inquérito:', 14, 38);

//     const infoInquerito = [
//       ['ID:', inquerito.id ?? ''],
//       ['Número Justiça:', inquerito.numeroJustica ?? ''],
//       ['Ordem IP:', inquerito.ordemIp ?? ''],
//       ['Data:', inquerito.data ? new Date(inquerito.data).toLocaleDateString() : ''],
//       ['Peça:', inquerito.peca ?? ''],
//       ['Relator:', inquerito.relator ?? ''],
//       ['Investigado:', inquerito.investigado ?? ''],
//       ['Vítima:', inquerito.vitima ?? ''],
//       ['Delito:', inquerito.naturezaDoDelito ?? ''],
//       ['Situação:', inquerito.situacao ?? '']
//     ];

//     autoTable(doc, {
//       startY: 42,
//       body: infoInquerito,
//       styles: { fontSize: 10, cellPadding: 1 },
//       theme: 'grid',
//       margin: { left: 14 },
//       columnStyles: {
//         0: { fontStyle: 'bold', halign: 'right', cellWidth: 40 },
//         1: { cellWidth: 140 }
//       }
//     });

//     let yAtual = doc.lastAutoTable.finalY + 10;

//     if (Array.isArray(inquerito.armas) && inquerito.armas.length > 0) {
//       doc.setFontSize(12);
//       doc.text('Armas Apreendidas:', 14, yAtual);
//       yAtual += 4;

//       const armasData = inquerito.armas.map(arma => [
//         arma.tipoArmaFogo || '',
//         arma.calibre || '',
//         arma.especie || '',
//         arma.capacidade || '',
//         arma.marca || '',
//         arma.quantidade || '',
//         arma.numeroPorte || '',
//         arma.numeroRegistro || '',
//         arma.numeroSerie || '',
//         arma.localArma || '',
//       ]);

//       autoTable(doc, {
//         head: [['Tipo', 'Calibre', 'Espécie', 'Capacidade', 'Marca', 'Quantidade', 'Nº Porte', 'Nº Registro', 'Nº Série', 'Local']],
//         body: armasData,
//         startY: yAtual,
//         styles: { fontSize: 10, cellPadding: 1 },
//         headStyles: { fillColor: [52, 58, 64], textColor: 255 },
//         alternateRowStyles: { fillColor: [240, 240, 240] },
//         margin: { left: 14 }
//       });

//       yAtual = doc.lastAutoTable.finalY + 10;
//     }

//     if (Array.isArray(inquerito.drogas) && inquerito.drogas.length > 0) {
//       doc.setFontSize(12);
//       doc.text('Drogas Apreendidas:', 14, yAtual);
//       yAtual += 4;

//       const drogasData = inquerito.drogas.map(droga => [
//         droga.tipoDroga || '',
//         droga.nomePopular || '',
//         droga.numeroLacre || '',
//         droga.unidadeMedida || '',
//         droga.quantidadePericia || '',
//         droga.quantidadePorExtenso || '',
//         droga.observacao || '',
//         droga.quantidade ? `${droga.quantidade} ${droga.unidadeMedida || ''}` : ''
//       ]);

//       autoTable(doc, {
//         head: [['Tipo', 'Nome Popular', 'Nº Lacre', 'Unidade Medida', 'Qtd Periciada', 'Qtd Extenso', 'Observação', 'Quantidade']],
//         body: drogasData,
//         startY: yAtual,
//         styles: { fontSize: 10, cellPadding: 1 },
//         headStyles: { fillColor: [52, 58, 64], textColor: 255 },
//         alternateRowStyles: { fillColor: [240, 240, 240] },
//         margin: { left: 14 }
//       });

//       yAtual = doc.lastAutoTable.finalY + 10;
//     }

//     const totalPagesExp = '{total_pages_count_string}';
//     if ((doc as any).putTotalPages) {
//       doc.setFontSize(10);
//       doc.text(`Página 1 de ${totalPagesExp}`, 14, doc.internal.pageSize.height - 10);
//       doc.putTotalPages(totalPagesExp);
//     }

//     doc.save(`relatorio_inquerito_${inquerito.id}.pdf`);
//   }
// }

