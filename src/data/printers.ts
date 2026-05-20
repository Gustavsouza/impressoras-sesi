import type { Printer } from '../types/printer';

export const printers: Printer[] = [
  // ── JARDIM DA PENHA ──────────────────────────────────────────
  {
    id: 1, model: 'HP E42540', sector: 'CAC', ip: '10.50.8.11',
    unit: 'JARDIM DA PENHA', rep: 'H434', serial: 'BRBSR6N0MS',
    queue: 'SESI_VITORIA_JARDIMDAPENHA_CAC',
    toner: 78, pagesRemaining: 4200, status: 'online', type: 'laser',
  },
  {
    id: 2, model: 'HP 4003', sector: 'ADMINISTRATIVO', ip: '10.50.8.20',
    unit: 'JARDIM DA PENHA', rep: 'M896', serial: 'BRBST1X11H', pin: '47847796',
    queue: 'SESI_VITORIA_JARDIMDAPENHA_ADMINISTRATIVO',
    toner: 50, pagesRemaining: 3150, status: 'online', type: 'laser',
  },
  {
    id: 3, model: 'HP E42540', sector: 'COORD PEDAGOGICO', ip: '10.50.8.17',
    unit: 'JARDIM DA PENHA', rep: 'H489', serial: 'BRBSR8N06R',
    queue: 'SESI_VITORIA_JARDIMDAPENHA_PEDAGOGICO_PB',
    toner: 23, pagesRemaining: 1200, status: 'warning', type: 'laser',
  },
  {
    id: 4, model: 'HP 4003', sector: 'GERENCIA', ip: '10.50.8.16',
    unit: 'JARDIM DA PENHA', rep: 'M830', serial: 'BRBST1X11L', pin: '47859803',
    queue: 'SESI_VITORIA_JARDIMDAPENHA_GERENCIA',
    toner: 91, pagesRemaining: 8000, status: 'online', type: 'laser',
  },
  {
    id: 5, model: 'HP 4003', sector: 'DIREÇÃO', ip: '10.50.8.18',
    unit: 'JARDIM DA PENHA', rep: 'M817', serial: 'BRBST1X117', pin: '47829321',
    queue: 'SESI_VITORIA_JARDIMDAPENHA_DIRECAO',
    toner: 50, pagesRemaining: 9700, status: 'online', type: 'laser',
  },
  {
    id: 6, model: 'EPSON C5890', sector: 'COORD PEDAGOGICO', ip: '10.50.8.10',
    unit: 'JARDIM DA PENHA', rep: 'M965', serial: 'XBJZ036138',
    queue: 'SESI_VITORIA_JARDIMDAPENHA_PEDAGOGICO_CL',
    black: 32, cyan: 96, magenta: 1, yellow: 96, status: 'warning', type: 'ink',
  },
  {
    id: 7, model: 'HP 4003', sector: 'CULTURA ORQUESTRA', ip: '10.50.8.36',
    unit: 'JARDIM DA PENHA', rep: 'M804', serial: 'BRBST1X12G', pin: '47911045',
    queue: 'SESI_VITORIA_JARDIMDAPENHA_ORQUESTRA',
    toner: 64, pagesRemaining: 5100, status: 'online', type: 'laser',
  },
  {
    id: 8, model: 'HP E42540', sector: 'SECRETARIA', ip: '10.50.8.19',
    unit: 'JARDIM DA PENHA', rep: 'H487', serial: 'BRBSR8N062',
    queue: 'SESI_VITORIA_JARDIMDAPENHA_SECRETARIA',
    toner: 14, pagesRemaining: 800, status: 'critical', type: 'laser',
  },
  {
    id: 9, model: 'HP E42540', sector: 'CULTURA ADMINISTRATIVO', ip: '10.50.8.13',
    unit: 'JARDIM DA PENHA', rep: 'K054', serial: 'BRBSRC8022',
    queue: 'SESI_VITORIA_JARDIMDAPENHA_CULTURA',
    toner: 88, pagesRemaining: 7200, status: 'online', type: 'laser',
  },
  {
    id: 10, model: 'HP E42540', sector: 'SESI SAUDE SST', ip: '10.50.8.35',
    unit: 'JARDIM DA PENHA', rep: 'H515', serial: 'BRBSR8N083',
    queue: 'SESI_VITORIA_JARDIMDAPENHA_SST_PB',
    toner: 50, pagesRemaining: 3150, status: 'online', type: 'laser',
  },
  {
    id: 11, model: 'EPSON C5890', sector: 'SESI SAUDE SST', ip: '10.50.8.24',
    unit: 'JARDIM DA PENHA', rep: 'L384', serial: 'XBJZ020824',
    queue: 'SESI_VITORIA_JARDIMDAPENHA_SST_CL',
    black: 72, cyan: 88, magenta: 64, yellow: 92, status: 'online', type: 'ink',
  },
  {
    id: 12, model: 'HP E42540', sector: 'ARQUIVO CENTRAL', ip: '10.50.8.12',
    unit: 'JARDIM DA PENHA', rep: 'H500', serial: 'BRBSR8N053',
    queue: 'SESI_VITORIA_JARDIMDAPENHA_ARQUIVO',
    toner: 39, pagesRemaining: 2100, status: 'warning', type: 'laser',
  },

  // ── MARUIPE ──────────────────────────────────────────────────
  {
    id: 13, model: 'HP 4003', sector: 'COORDENAÇÃO PEDAGOGICA', ip: '10.40.8.13',
    unit: 'MARUIPE', rep: 'M539', serial: 'BRBST1Z1KV', pin: '54035243',
    queue: 'SESI_VITORIA_MARUIPE_COORDENACAO_PEDAGOGICA',
    toner: 65, pagesRemaining: 4500, status: 'online', type: 'laser',
  },
  {
    id: 14, model: 'HP E42540', sector: 'ASSISTENTE DISCIPLINA', ip: '10.40.8.11',
    unit: 'MARUIPE', rep: 'H478', serial: 'BRBSR8N05P',
    queue: 'SESI_VITORIA_MARUIPE_ASSITENCIA_DISCIPLINAR',
    toner: 88, pagesRemaining: 7000, status: 'online', type: 'laser',
  },
  {
    id: 15, model: 'HP E42540', sector: 'ADM/CAC', ip: '10.40.8.10',
    unit: 'MARUIPE', rep: 'H407', serial: 'BRBSR6N0JP',
    queue: 'SESI_VITORIA_MARUIPE_CAC',
    toner: 22, pagesRemaining: 900, status: 'warning', type: 'laser',
  },
  {
    id: 16, model: 'EPSON C5890', sector: 'DIRETORIA', ip: '10.40.8.12',
    unit: 'MARUIPE', rep: 'L376', serial: 'XBJZ020808',
    queue: 'SESI_VITORIA_MARUIPE_DIRECAO_CL',
    black: 48, cyan: 65, magenta: 72, yellow: 55, status: 'online', type: 'ink',
  },
  {
    id: 17, model: 'HP E42540', sector: 'SECRETARIA ESCOLAR', ip: '10.40.8.14',
    unit: 'MARUIPE', rep: 'H541', serial: 'BRBSR6N0P4',
    queue: 'SESI_VITORIA_MARUIPE_SECRETARIA',
    toner: 74, pagesRemaining: 5300, status: 'online', type: 'laser',
  },
];
