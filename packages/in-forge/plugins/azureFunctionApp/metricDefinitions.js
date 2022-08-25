/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { number, bytes, seconds } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metric: 'br_co',
    label: t('in-forge:plugins.azureFunctionApp.labelBrCo'),
    category: [t('in-forge:plugins.azureFunctionApp.bytes')],
    min: 0,
    formatter: bytes
  },
  {
    metric: 'br_av',
    label: t('in-forge:plugins.azureFunctionApp.labelBrAv'),
    category: [t('in-forge:plugins.azureFunctionApp.bytes')],
    min: 0,
    formatter: bytes
  },
  {
    metric: 'br_mi',
    label: t('in-forge:plugins.azureFunctionApp.labelBrMi'),
    category: [t('in-forge:plugins.azureFunctionApp.bytes')],
    min: 0,
    formatter: bytes
  },
  {
    metric: 'br_mx',
    label: t('in-forge:plugins.azureFunctionApp.labelBrMx'),
    category: [t('in-forge:plugins.azureFunctionApp.bytes')],
    min: 0,
    formatter: bytes
  },
  {
    metric: 'br_to',
    label: t('in-forge:plugins.azureFunctionApp.labelBrTo'),
    category: [t('in-forge:plugins.azureFunctionApp.bytes')],
    min: 0,
    formatter: number
  },

  {
    metric: 'bs_co',
    label: t('in-forge:plugins.azureFunctionApp.labelBsCo'),
    category: [t('in-forge:plugins.azureFunctionApp.bytes')],
    min: 0,
    formatter: bytes
  },
  {
    metric: 'bs_av',
    label: t('in-forge:plugins.azureFunctionApp.labelBsAv'),
    category: [t('in-forge:plugins.azureFunctionApp.bytes')],
    min: 0,
    formatter: bytes
  },
  {
    metric: 'bs_mi',
    label: t('in-forge:plugins.azureFunctionApp.labelBsMi'),
    category: [t('in-forge:plugins.azureFunctionApp.bytes')],
    min: 0,
    formatter: bytes
  },
  {
    metric: 'bs_mx',
    label: t('in-forge:plugins.azureFunctionApp.labelBsMx'),
    category: [t('in-forge:plugins.azureFunctionApp.bytes')],
    min: 0,
    formatter: bytes
  },
  {
    metric: 'bs_to',
    label: t('in-forge:plugins.azureFunctionApp.labelBsTo'),
    category: [t('in-forge:plugins.azureFunctionApp.bytes')],
    min: 0,
    formatter: number
  },

  {
    metric: 'pb_co',
    label: t('in-forge:plugins.azureFunctionApp.labelPbCo'),
    category: [t('in-forge:plugins.azureFunctionApp.bytes')],
    min: 0,
    formatter: bytes
  },
  {
    metric: 'pb_av',
    label: t('in-forge:plugins.azureFunctionApp.labelPbAv'),
    category: [t('in-forge:plugins.azureFunctionApp.bytes')],
    min: 0,
    formatter: bytes
  },
  {
    metric: 'pb_mi',
    label: t('in-forge:plugins.azureFunctionApp.labelPbMi'),
    category: [t('in-forge:plugins.azureFunctionApp.bytes')],
    min: 0,
    formatter: bytes
  },
  {
    metric: 'pb_mx',
    label: t('in-forge:plugins.azureFunctionApp.labelPbMx'),
    category: [t('in-forge:plugins.azureFunctionApp.bytes')],
    min: 0,
    formatter: bytes
  },
  {
    metric: 'pb_to',
    label: t('in-forge:plugins.azureFunctionApp.labelPbTo'),
    category: [t('in-forge:plugins.azureFunctionApp.bytes')],
    min: 0,
    formatter: number
  },


  {
    metric: 'rq_co',
    label: t('in-forge:plugins.azureFunctionApp.labelRqCo'),
    category: [t('in-forge:plugins.azureFunctionApp.requests')],
    min: 0,
    formatter: number
  },
  {
    metric: 'rq_av',
    label: t('in-forge:plugins.azureFunctionApp.labelRqAv'),
    category: [t('in-forge:plugins.azureFunctionApp.requests')],
    min: 0,
    formatter: number
  },
  {
    metric: 'rq_mi',
    label: t('in-forge:plugins.azureFunctionApp.labelRqMi'),
    category: [t('in-forge:plugins.azureFunctionApp.requests')],
    min: 0,
    formatter: number
  },
  {
    metric: 'rq_mx',
    label: t('in-forge:plugins.azureFunctionApp.labelRqMx'),
    category: [t('in-forge:plugins.azureFunctionApp.requests')],
    min: 0,
    formatter: number
  },
  {
    metric: 'rq_to',
    label: t('in-forge:plugins.azureFunctionApp.labelRqTo'),
    category: [t('in-forge:plugins.azureFunctionApp.requests')],
    min: 0,
    formatter: number
  },

  {
    metric: 'h1_co',
    label: t('in-forge:plugins.azureFunctionApp.labelH1Co'),
    category: [t('in-forge:plugins.azureFunctionApp.requests')],
    min: 0,
    formatter: number
  },
  {
    metric: 'h1_av',
    label: t('in-forge:plugins.azureFunctionApp.labelH1Av'),
    category: [t('in-forge:plugins.azureFunctionApp.requests')],
    min: 0,
    formatter: number
  },
  {
    metric: 'h1_mi',
    label: t('in-forge:plugins.azureFunctionApp.labelH1Mi'),
    category: [t('in-forge:plugins.azureFunctionApp.requests')],
    min: 0,
    formatter: number
  },
  {
    metric: 'h1_mx',
    label: t('in-forge:plugins.azureFunctionApp.labelH1Mx'),
    category: [t('in-forge:plugins.azureFunctionApp.requests')],
    min: 0,
    formatter: number
  },
  {
    metric: 'h1_to',
    label: t('in-forge:plugins.azureFunctionApp.labelH1To'),
    category: [t('in-forge:plugins.azureFunctionApp.requests')],
    min: 0,
    formatter: number
  },

  {
    metric: 'h2_co',
    label: t('in-forge:plugins.azureFunctionApp.labelH2Co'),
    category: [t('in-forge:plugins.azureFunctionApp.requests')],
    min: 0,
    formatter: number
  },
  {
    metric: 'h2_av',
    label: t('in-forge:plugins.azureFunctionApp.labelH2Av'),
    category: [t('in-forge:plugins.azureFunctionApp.requests')],
    min: 0,
    formatter: number
  },
  {
    metric: 'h2_mi',
    label: t('in-forge:plugins.azureFunctionApp.labelH2Mi'),
    category: [t('in-forge:plugins.azureFunctionApp.requests')],
    min: 0,
    formatter: number
  },
  {
    metric: 'h2_mx',
    label: t('in-forge:plugins.azureFunctionApp.labelH2Mx'),
    category: [t('in-forge:plugins.azureFunctionApp.requests')],
    min: 0,
    formatter: number
  },
  {
    metric: 'h2_to',
    label: t('in-forge:plugins.azureFunctionApp.labelH2To'),
    category: [t('in-forge:plugins.azureFunctionApp.requests')],
    min: 0,
    formatter: number
  },

  {
    metric: 'h3_co',
    label: t('in-forge:plugins.azureFunctionApp.labelH3Co'),
    category: [t('in-forge:plugins.azureFunctionApp.requests')],
    min: 0,
    formatter: number
  },
  {
    metric: 'h3_av',
    label: t('in-forge:plugins.azureFunctionApp.labelH3Av'),
    category: [t('in-forge:plugins.azureFunctionApp.requests')],
    min: 0,
    formatter: number
  },
  {
    metric: 'h3_mi',
    label: t('in-forge:plugins.azureFunctionApp.labelH3Mi'),
    category: [t('in-forge:plugins.azureFunctionApp.requests')],
    min: 0,
    formatter: number
  },
  {
    metric: 'h3_mx',
    label: t('in-forge:plugins.azureFunctionApp.labelH3Mx'),
    category: [t('in-forge:plugins.azureFunctionApp.requests')],
    min: 0,
    formatter: number
  },
  {
    metric: 'h3_to',
    label: t('in-forge:plugins.azureFunctionApp.labelH3To'),
    category: [t('in-forge:plugins.azureFunctionApp.requests')],
    min: 0,
    formatter: number
  },

  {
    metric: 'h41_co',
    label: t('in-forge:plugins.azureFunctionApp.labelH41Co'),
    category: [t('in-forge:plugins.azureFunctionApp.requests')],
    min: 0,
    formatter: number
  },
  {
    metric: 'h41_av',
    label: t('in-forge:plugins.azureFunctionApp.labelH41Av'),
    category: [t('in-forge:plugins.azureFunctionApp.requests')],
    min: 0,
    formatter: number
  },
  {
    metric: 'h41_mi',
    label: t('in-forge:plugins.azureFunctionApp.labelH41Mi'),
    category: [t('in-forge:plugins.azureFunctionApp.requests')],
    min: 0,
    formatter: number
  },
  {
    metric: 'h41_mx',
    label: t('in-forge:plugins.azureFunctionApp.labelH41Mx'),
    category: [t('in-forge:plugins.azureFunctionApp.requests')],
    min: 0,
    formatter: number
  },
  {
    metric: 'h41_to',
    label: t('in-forge:plugins.azureFunctionApp.labelH41To'),
    category: [t('in-forge:plugins.azureFunctionApp.requests')],
    min: 0,
    formatter: number
  },

  {
    metric: 'h43_co',
    label: t('in-forge:plugins.azureFunctionApp.labelH43Co'),
    category: [t('in-forge:plugins.azureFunctionApp.requests')],
    min: 0,
    formatter: number
  },
  {
    metric: 'h43_av',
    label: t('in-forge:plugins.azureFunctionApp.labelH43Av'),
    category: [t('in-forge:plugins.azureFunctionApp.requests')],
    min: 0,
    formatter: number
  },
  {
    metric: 'h43_mi',
    label: t('in-forge:plugins.azureFunctionApp.labelH43Mi'),
    category: [t('in-forge:plugins.azureFunctionApp.requests')],
    min: 0,
    formatter: number
  },
  {
    metric: 'h43_mx',
    label: t('in-forge:plugins.azureFunctionApp.labelH43Mx'),
    category: [t('in-forge:plugins.azureFunctionApp.requests')],
    min: 0,
    formatter: number
  },
  {
    metric: 'h43_to',
    label: t('in-forge:plugins.azureFunctionApp.labelH43To'),
    category: [t('in-forge:plugins.azureFunctionApp.requests')],
    min: 0,
    formatter: number
  },

  {
    metric: 'h44_co',
    label: t('in-forge:plugins.azureFunctionApp.labelH44Co'),
    category: [t('in-forge:plugins.azureFunctionApp.requests')],
    min: 0,
    formatter: number
  },
  {
    metric: 'h44_av',
    label: t('in-forge:plugins.azureFunctionApp.labelH44Av'),
    category: [t('in-forge:plugins.azureFunctionApp.requests')],
    min: 0,
    formatter: number
  },
  {
    metric: 'h44_mi',
    label: t('in-forge:plugins.azureFunctionApp.labelH44Mi'),
    category: [t('in-forge:plugins.azureFunctionApp.requests')],
    min: 0,
    formatter: number
  },
  {
    metric: 'h44_mx',
    label: t('in-forge:plugins.azureFunctionApp.labelH44Mx'),
    category: [t('in-forge:plugins.azureFunctionApp.requests')],
    min: 0,
    formatter: number
  },
  {
    metric: 'h44_to',
    label: t('in-forge:plugins.azureFunctionApp.labelH44To'),
    category: [t('in-forge:plugins.azureFunctionApp.requests')],
    min: 0,
    formatter: number
  },

  {
    metric: 'h46_co',
    label: t('in-forge:plugins.azureFunctionApp.labelH46Co'),
    category: [t('in-forge:plugins.azureFunctionApp.requests')],
    min: 0,
    formatter: number
  },
  {
    metric: 'h46_av',
    label: t('in-forge:plugins.azureFunctionApp.labelH46Av'),
    category: [t('in-forge:plugins.azureFunctionApp.requests')],
    min: 0,
    formatter: number
  },
  {
    metric: 'h46_mi',
    label: t('in-forge:plugins.azureFunctionApp.labelH46Mi'),
    category: [t('in-forge:plugins.azureFunctionApp.requests')],
    min: 0,
    formatter: number
  },
  {
    metric: 'h46_mx',
    label: t('in-forge:plugins.azureFunctionApp.labelH46Mx'),
    category: [t('in-forge:plugins.azureFunctionApp.requests')],
    min: 0,
    formatter: number
  },
  {
    metric: 'h46_to',
    label: t('in-forge:plugins.azureFunctionApp.labelH46To'),
    category: [t('in-forge:plugins.azureFunctionApp.requests')],
    min: 0,
    formatter: number
  },

  {
    metric: 'h4_co',
    label: t('in-forge:plugins.azureFunctionApp.labelH4Co'),
    category: [t('in-forge:plugins.azureFunctionApp.requests')],
    min: 0,
    formatter: number
  },
  {
    metric: 'h4_av',
    label: t('in-forge:plugins.azureFunctionApp.labelH4Av'),
    category: [t('in-forge:plugins.azureFunctionApp.requests')],
    min: 0,
    formatter: number
  },
  {
    metric: 'h4_mi',
    label: t('in-forge:plugins.azureFunctionApp.labelH4Mi'),
    category: [t('in-forge:plugins.azureFunctionApp.requests')],
    min: 0,
    formatter: number
  },
  {
    metric: 'h4_mx',
    label: t('in-forge:plugins.azureFunctionApp.labelH4Mx'),
    category: [t('in-forge:plugins.azureFunctionApp.requests')],
    min: 0,
    formatter: number
  },
  {
    metric: 'h4_to',
    label: t('in-forge:plugins.azureFunctionApp.labelH4To'),
    category: [t('in-forge:plugins.azureFunctionApp.requests')],
    min: 0,
    formatter: number
  },

  {
    metric: 'h5_co',
    label: t('in-forge:plugins.azureFunctionApp.labelH5Co'),
    category: [t('in-forge:plugins.azureFunctionApp.requests')],
    min: 0,
    formatter: number
  },
  {
    metric: 'h5_av',
    label: t('in-forge:plugins.azureFunctionApp.labelH5Av'),
    category: [t('in-forge:plugins.azureFunctionApp.requests')],
    min: 0,
    formatter: number
  },
  {
    metric: 'h5_mi',
    label: t('in-forge:plugins.azureFunctionApp.labelH5Mi'),
    category: [t('in-forge:plugins.azureFunctionApp.requests')],
    min: 0,
    formatter: number
  },
  {
    metric: 'h5_mx',
    label: t('in-forge:plugins.azureFunctionApp.labelH5Mx'),
    category: [t('in-forge:plugins.azureFunctionApp.requests')],
    min: 0,
    formatter: number
  },
  {
    metric: 'h5_to',
    label: t('in-forge:plugins.azureFunctionApp.labelH5To'),
    category: [t('in-forge:plugins.azureFunctionApp.requests')],
    min: 0,
    formatter: number
  },

  {
    metric: 'art_co',
    label: t('in-forge:plugins.azureFunctionApp.labelArtCo'),
    category: [t('in-forge:plugins.azureFunctionApp.requests')],
    min: 0,
    formatter: seconds
  },
  {
    metric: 'art_av',
    label: t('in-forge:plugins.azureFunctionApp.labelArtAv'),
    category: [t('in-forge:plugins.azureFunctionApp.requests')],
    min: 0,
    formatter: seconds
  },
  {
    metric: 'art_mi',
    label: t('in-forge:plugins.azureFunctionApp.labelArtMi'),
    category: [t('in-forge:plugins.azureFunctionApp.requests')],
    min: 0,
    formatter: seconds
  },
  {
    metric: 'art_mx',
    label: t('in-forge:plugins.azureFunctionApp.labelArtMx'),
    category: [t('in-forge:plugins.azureFunctionApp.requests')],
    min: 0,
    formatter: seconds
  },
  {
    metric: 'art_to',
    label: t('in-forge:plugins.azureFunctionApp.labelArtTo'),
    category: [t('in-forge:plugins.azureFunctionApp.requests')],
    min: 0,
    formatter: number
  },

  {
    metric: 'hrt_co',
    label: t('in-forge:plugins.azureFunctionApp.labelHrtCo'),
    category: [t('in-forge:plugins.azureFunctionApp.requests')],
    min: 0,
    formatter: seconds
  },
  {
    metric: 'hrt_av',
    label: t('in-forge:plugins.azureFunctionApp.labelHrtAv'),
    category: [t('in-forge:plugins.azureFunctionApp.requests')],
    min: 0,
    formatter: seconds
  },
  {
    metric: 'hrt_mi',
    label: t('in-forge:plugins.azureFunctionApp.labelHrtMi'),
    category: [t('in-forge:plugins.azureFunctionApp.requests')],
    min: 0,
    formatter: seconds
  },
  {
    metric: 'hrt_mx',
    label: t('in-forge:plugins.azureFunctionApp.labelHrtMx'),
    category: [t('in-forge:plugins.azureFunctionApp.requests')],
    min: 0,
    formatter: seconds
  },
  {
    metric: 'hrt_to',
    label: t('in-forge:plugins.azureFunctionApp.labelHrtTo'),
    category: [t('in-forge:plugins.azureFunctionApp.requests')],
    min: 0,
    formatter: number
  },

  {
    metric: 'ha_co',
    label: t('in-forge:plugins.azureFunctionApp.labelHaCo'),
    category: [t('in-forge:plugins.azureFunctionApp.requests')],
    min: 0,
    formatter: number
  },
  {
    metric: 'ha_av',
    label: t('in-forge:plugins.azureFunctionApp.labelHaAv'),
    category: [t('in-forge:plugins.azureFunctionApp.requests')],
    min: 0,
    formatter: number
  },
  {
    metric: 'ha_mi',
    label: t('in-forge:plugins.azureFunctionApp.labelHaMi'),
    category: [t('in-forge:plugins.azureFunctionApp.requests')],
    min: 0,
    formatter: number
  },
  {
    metric: 'ha_mx',
    label: t('in-forge:plugins.azureFunctionApp.labelHaMx'),
    category: [t('in-forge:plugins.azureFunctionApp.requests')],
    min: 0,
    formatter: number
  },
  {
    metric: 'ha_to',
    label: t('in-forge:plugins.azureFunctionApp.labelHaTo'),
    category: [t('in-forge:plugins.azureFunctionApp.requests')],
    min: 0,
    formatter: number
  },

  {
    metric: 'th_co',
    label: t('in-forge:plugins.azureFunctionApp.labelThCo'),
    category: [t('in-forge:plugins.azureFunctionApp.requests')],
    min: 0,
    formatter: number
  },
  {
    metric: 'th_av',
    label: t('in-forge:plugins.azureFunctionApp.labelThAv'),
    category: [t('in-forge:plugins.azureFunctionApp.requests')],
    min: 0,
    formatter: number
  },
  {
    metric: 'th_mi',
    label: t('in-forge:plugins.azureFunctionApp.labelThMi'),
    category: [t('in-forge:plugins.azureFunctionApp.requests')],
    min: 0,
    formatter: number
  },
  {
    metric: 'th_mx',
    label: t('in-forge:plugins.azureFunctionApp.labelThMx'),
    category: [t('in-forge:plugins.azureFunctionApp.requests')],
    min: 0,
    formatter: number
  },
  {
    metric: 'th_to',
    label: t('in-forge:plugins.azureFunctionApp.labelThTo'),
    category: [t('in-forge:plugins.azureFunctionApp.requests')],
    min: 0,
    formatter: number
  },

  {
    metric: 'riaq_co',
    label: t('in-forge:plugins.azureFunctionApp.labelRiaqCo'),
    category: [t('in-forge:plugins.azureFunctionApp.requests')],
    min: 0,
    formatter: number
  },
  {
    metric: 'riaq_av',
    label: t('in-forge:plugins.azureFunctionApp.labelRiaqAv'),
    category: [t('in-forge:plugins.azureFunctionApp.requests')],
    min: 0,
    formatter: number
  },
  {
    metric: 'riaq_mi',
    label: t('in-forge:plugins.azureFunctionApp.labelRiaqMi'),
    category: [t('in-forge:plugins.azureFunctionApp.requests')],
    min: 0,
    formatter: number
  },
  {
    metric: 'riaq_mx',
    label: t('in-forge:plugins.azureFunctionApp.labelRiaqMx'),
    category: [t('in-forge:plugins.azureFunctionApp.requests')],
    min: 0,
    formatter: number
  },
  {
    metric: 'riaq_to',
    label: t('in-forge:plugins.azureFunctionApp.labelRiaqTo'),
    category: [t('in-forge:plugins.azureFunctionApp.requests')],
    min: 0,
    formatter: number
  },

  
  {
    metric: 'mws_co',
    label: t('in-forge:plugins.azureFunctionApp.labelMwsCo'),
    category: [t('in-forge:plugins.azureFunctionApp.workingSet')],
    min: 0,
    formatter: bytes
  },
  {
    metric: 'mws_av',
    label: t('in-forge:plugins.azureFunctionApp.labelMwsAv'),
    category: [t('in-forge:plugins.azureFunctionApp.workingSet')],
    min: 0,
    formatter: bytes
  },
  {
    metric: 'mws_mi',
    label: t('in-forge:plugins.azureFunctionApp.labelMwsMi'),
    category: [t('in-forge:plugins.azureFunctionApp.workingSet')],
    min: 0,
    formatter: bytes
  },
  {
    metric: 'mws_mx',
    label: t('in-forge:plugins.azureFunctionApp.labelMwsMx'),
    category: [t('in-forge:plugins.azureFunctionApp.workingSet')],
    min: 0,
    formatter: bytes
  },
  {
    metric: 'mws_to',
    label: t('in-forge:plugins.azureFunctionApp.labelMwsTo'),
    category: [t('in-forge:plugins.azureFunctionApp.workingSet')],
    min: 0,
    formatter: number
  },

  {
    metric: 'amws_co',
    label: t('in-forge:plugins.azureFunctionApp.labelAmwsCo'),
    category: [t('in-forge:plugins.azureFunctionApp.workingSet')],
    min: 0,
    formatter: bytes
  },
  {
    metric: 'amws_av',
    label: t('in-forge:plugins.azureFunctionApp.labelAmwsAv'),
    category: [t('in-forge:plugins.azureFunctionApp.workingSet')],
    min: 0,
    formatter: bytes
  },
  {
    metric: 'amws_mi',
    label: t('in-forge:plugins.azureFunctionApp.labelAmwsMi'),
    category: [t('in-forge:plugins.azureFunctionApp.workingSet')],
    min: 0,
    formatter: bytes
  },
  {
    metric: 'amws_mx',
    label: t('in-forge:plugins.azureFunctionApp.labelAmwsMx'),
    category: [t('in-forge:plugins.azureFunctionApp.workingSet')],
    min: 0,
    formatter: bytes
  },
  {
    metric: 'amws_to',
    label: t('in-forge:plugins.azureFunctionApp.labelAmwsTo'),
    category: [t('in-forge:plugins.azureFunctionApp.workingSet')],
    min: 0,
    formatter: number
  },


  {
    metric: 'feu_co',
    label: t('in-forge:plugins.azureFunctionApp.labelFeuCo'),
    category: [t('in-forge:plugins.azureFunctionApp.functionExecution')],
    min: 0,
    formatter: number
  },
  {
    metric: 'feu_av',
    label: t('in-forge:plugins.azureFunctionApp.labelFeuAv'),
    category: [t('in-forge:plugins.azureFunctionApp.functionExecution')],
    min: 0,
    formatter: number
  },
  {
    metric: 'feu_mi',
    label: t('in-forge:plugins.azureFunctionApp.labelFeuMi'),
    category: [t('in-forge:plugins.azureFunctionApp.functionExecution')],
    min: 0,
    formatter: number
  },
  {
    metric: 'feu_mx',
    label: t('in-forge:plugins.azureFunctionApp.labelFeuMx'),
    category: [t('in-forge:plugins.azureFunctionApp.functionExecution')],
    min: 0,
    formatter: number
  },
  {
    metric: 'feu_to',
    label: t('in-forge:plugins.azureFunctionApp.labelFeuTo'),
    category: [t('in-forge:plugins.azureFunctionApp.functionExecution')],
    min: 0,
    formatter: number
  },

  {
    metric: 'fec_co',
    label: t('in-forge:plugins.azureFunctionApp.labelFecCo'),
    category: [t('in-forge:plugins.azureFunctionApp.functionExecution')],
    min: 0,
    formatter: number
  },
  {
    metric: 'fec_av',
    label: t('in-forge:plugins.azureFunctionApp.labelFecAv'),
    category: [t('in-forge:plugins.azureFunctionApp.functionExecution')],
    min: 0,
    formatter: number
  },
  {
    metric: 'fec_mi',
    label: t('in-forge:plugins.azureFunctionApp.labelFecMi'),
    category: [t('in-forge:plugins.azureFunctionApp.functionExecution')],
    min: 0,
    formatter: number
  },
  {
    metric: 'fec_mx',
    label: t('in-forge:plugins.azureFunctionApp.labelFecMx'),
    category: [t('in-forge:plugins.azureFunctionApp.functionExecution')],
    min: 0,
    formatter: number
  },
  {
    metric: 'fec_to',
    label: t('in-forge:plugins.azureFunctionApp.labelFecTo'),
    category: [t('in-forge:plugins.azureFunctionApp.functionExecution')],
    min: 0,
    formatter: number
  },


  {
    metric: 'iorbps_co',
    label: t('in-forge:plugins.azureFunctionApp.labelIorbpsCo'),
    category: [t('in-forge:plugins.azureFunctionApp.io')],
    min: 0,
    formatter: bytes
  },
  {
    metric: 'iorbps_av',
    label: t('in-forge:plugins.azureFunctionApp.labelIorbpsAv'),
    category: [t('in-forge:plugins.azureFunctionApp.io')],
    min: 0,
    formatter: bytes
  },
  {
    metric: 'iorbps_mi',
    label: t('in-forge:plugins.azureFunctionApp.labelIorbpsMi'),
    category: [t('in-forge:plugins.azureFunctionApp.io')],
    min: 0,
    formatter: bytes
  },
  {
    metric: 'iorbps_mx',
    label: t('in-forge:plugins.azureFunctionApp.labelIorbpsMx'),
    category: [t('in-forge:plugins.azureFunctionApp.io')],
    min: 0,
    formatter: bytes
  },
  {
    metric: 'iorbps_to',
    label: t('in-forge:plugins.azureFunctionApp.labelIorbpsTo'),
    category: [t('in-forge:plugins.azureFunctionApp.io')],
    min: 0,
    formatter: number
  },
  
  {
    metric: 'iowbps_co',
    label: t('in-forge:plugins.azureFunctionApp.labelIowbpsCo'),
    category: [t('in-forge:plugins.azureFunctionApp.io')],
    min: 0,
    formatter: bytes
  },
  {
    metric: 'iowbps_av',
    label: t('in-forge:plugins.azureFunctionApp.labelIowbpsAv'),
    category: [t('in-forge:plugins.azureFunctionApp.io')],
    min: 0,
    formatter: bytes
  },
  {
    metric: 'iowbps_mi',
    label: t('in-forge:plugins.azureFunctionApp.labelIowbpsMi'),
    category: [t('in-forge:plugins.azureFunctionApp.io')],
    min: 0,
    formatter: bytes
  },
  {
    metric: 'iowbps_mx',
    label: t('in-forge:plugins.azureFunctionApp.labelIowbpsMx'),
    category: [t('in-forge:plugins.azureFunctionApp.io')],
    min: 0,
    formatter: bytes
  },
  {
    metric: 'iowbps_to',
    label: t('in-forge:plugins.azureFunctionApp.labelIowbpsTo'),
    category: [t('in-forge:plugins.azureFunctionApp.io')],
    min: 0,
    formatter: number
  },
  
  {
    metric: 'ioobps_co',
    label: t('in-forge:plugins.azureFunctionApp.labelIoobpsCo'),
    category: [t('in-forge:plugins.azureFunctionApp.io')],
    min: 0,
    formatter: bytes
  },
  {
    metric: 'ioobps_av',
    label: t('in-forge:plugins.azureFunctionApp.labelIoobpsAv'),
    category: [t('in-forge:plugins.azureFunctionApp.io')],
    min: 0,
    formatter: bytes
  },
  {
    metric: 'ioobps_mi',
    label: t('in-forge:plugins.azureFunctionApp.labelIoobpsMi'),
    category: [t('in-forge:plugins.azureFunctionApp.io')],
    min: 0,
    formatter: bytes
  },
  {
    metric: 'ioobps_mx',
    label: t('in-forge:plugins.azureFunctionApp.labelIoobpsMx'),
    category: [t('in-forge:plugins.azureFunctionApp.io')],
    min: 0,
    formatter: bytes
  },
  {
    metric: 'ioobps_to',
    label: t('in-forge:plugins.azureFunctionApp.labelIoobpsTo'),
    category: [t('in-forge:plugins.azureFunctionApp.io')],
    min: 0,
    formatter: number
  },
  
  {
    metric: 'iorops_co',
    label: t('in-forge:plugins.azureFunctionApp.labelIoropsCo'),
    category: [t('in-forge:plugins.azureFunctionApp.io')],
    min: 0,
    formatter: bytes
  },
  {
    metric: 'iorops_av',
    label: t('in-forge:plugins.azureFunctionApp.labelIoropsAv'),
    category: [t('in-forge:plugins.azureFunctionApp.io')],
    min: 0,
    formatter: bytes
  },
  {
    metric: 'iorops_mi',
    label: t('in-forge:plugins.azureFunctionApp.labelIoropsMi'),
    category: [t('in-forge:plugins.azureFunctionApp.io')],
    min: 0,
    formatter: bytes
  },
  {
    metric: 'iorops_mx',
    label: t('in-forge:plugins.azureFunctionApp.labelIoropsMx'),
    category: [t('in-forge:plugins.azureFunctionApp.io')],
    min: 0,
    formatter: bytes
  },
  {
    metric: 'iorops_to',
    label: t('in-forge:plugins.azureFunctionApp.labelIoropsTo'),
    category: [t('in-forge:plugins.azureFunctionApp.io')],
    min: 0,
    formatter: number
  },
  
  {
    metric: 'iowops_co',
    label: t('in-forge:plugins.azureFunctionApp.labelIowopsCo'),
    category: [t('in-forge:plugins.azureFunctionApp.io')],
    min: 0,
    formatter: bytes
  },
  {
    metric: 'iowops_av',
    label: t('in-forge:plugins.azureFunctionApp.labelIowopsAv'),
    category: [t('in-forge:plugins.azureFunctionApp.io')],
    min: 0,
    formatter: bytes
  },
  {
    metric: 'iowops_mi',
    label: t('in-forge:plugins.azureFunctionApp.labelIowopsMi'),
    category: [t('in-forge:plugins.azureFunctionApp.io')],
    min: 0,
    formatter: bytes
  },
  {
    metric: 'iowops_mx',
    label: t('in-forge:plugins.azureFunctionApp.labelIowopsMx'),
    category: [t('in-forge:plugins.azureFunctionApp.io')],
    min: 0,
    formatter: bytes
  },
  {
    metric: 'iowops_to',
    label: t('in-forge:plugins.azureFunctionApp.labelIowopsTo'),
    category: [t('in-forge:plugins.azureFunctionApp.io')],
    min: 0,
    formatter: number
  },
  
  {
    metric: 'iooops_co',
    label: t('in-forge:plugins.azureFunctionApp.labelIooopsCo'),
    category: [t('in-forge:plugins.azureFunctionApp.io')],
    min: 0,
    formatter: bytes
  },
  {
    metric: 'iooops_av',
    label: t('in-forge:plugins.azureFunctionApp.labelIooopsAv'),
    category: [t('in-forge:plugins.azureFunctionApp.io')],
    min: 0,
    formatter: bytes
  },
  {
    metric: 'iooops_mi',
    label: t('in-forge:plugins.azureFunctionApp.labelIooopsMi'),
    category: [t('in-forge:plugins.azureFunctionApp.io')],
    min: 0,
    formatter: bytes
  },
  {
    metric: 'iooops_mx',
    label: t('in-forge:plugins.azureFunctionApp.labelIooopsMx'),
    category: [t('in-forge:plugins.azureFunctionApp.io')],
    min: 0,
    formatter: bytes
  },
  {
    metric: 'iooops_to',
    label: t('in-forge:plugins.azureFunctionApp.labelIooopsTo'),
    category: [t('in-forge:plugins.azureFunctionApp.io')],
    min: 0,
    formatter: number
  },

  
  {
    metric: 'tad_co',
    label: t('in-forge:plugins.azureFunctionApp.labelTadCo'),
    category: [t('in-forge:plugins.azureFunctionApp.appDomains')],
    min: 0,
    formatter: number
  },
  {
    metric: 'tad_av',
    label: t('in-forge:plugins.azureFunctionApp.labelTadAv'),
    category: [t('in-forge:plugins.azureFunctionApp.appDomains')],
    min: 0,
    formatter: number
  },
  {
    metric: 'tad_mi',
    label: t('in-forge:plugins.azureFunctionApp.labelTadMi'),
    category: [t('in-forge:plugins.azureFunctionApp.appDomains')],
    min: 0,
    formatter: number
  },
  {
    metric: 'tad_mx',
    label: t('in-forge:plugins.azureFunctionApp.labelTadMx'),
    category: [t('in-forge:plugins.azureFunctionApp.appDomains')],
    min: 0,
    formatter: number
  },
  {
    metric: 'tad_to',
    label: t('in-forge:plugins.azureFunctionApp.labelTadTo'),
    category: [t('in-forge:plugins.azureFunctionApp.appDomains')],
    min: 0,
    formatter: number
  },
 
  {
    metric: 'tadu_co',
    label: t('in-forge:plugins.azureFunctionApp.labelTaduCo'),
    category: [t('in-forge:plugins.azureFunctionApp.appDomains')],
    min: 0,
    formatter: number
  },
  {
    metric: 'tadu_av',
    label: t('in-forge:plugins.azureFunctionApp.labelTaduAv'),
    category: [t('in-forge:plugins.azureFunctionApp.appDomains')],
    min: 0,
    formatter: number
  },
  {
    metric: 'tadu_mi',
    label: t('in-forge:plugins.azureFunctionApp.labelTaduMi'),
    category: [t('in-forge:plugins.azureFunctionApp.appDomains')],
    min: 0,
    formatter: number
  },
  {
    metric: 'tadu_mx',
    label: t('in-forge:plugins.azureFunctionApp.labelTaduMx'),
    category: [t('in-forge:plugins.azureFunctionApp.appDomains')],
    min: 0,
    formatter: number
  },
  {
    metric: 'tadu_to',
    label: t('in-forge:plugins.azureFunctionApp.labelTaduTo'),
    category: [t('in-forge:plugins.azureFunctionApp.appDomains')],
    min: 0,
    formatter: number
  },


  {
    metric: 'g0c_co',
    label: t('in-forge:plugins.azureFunctionApp.labelG0cCo'),
    category: [t('in-forge:plugins.azureFunctionApp.genCollections')],
    min: 0,
    formatter: number
  },
  {
    metric: 'g0c_av',
    label: t('in-forge:plugins.azureFunctionApp.labelG0cAv'),
    category: [t('in-forge:plugins.azureFunctionApp.genCollections')],
    min: 0,
    formatter: number
  },
  {
    metric: 'g0c_mi',
    label: t('in-forge:plugins.azureFunctionApp.labelG0cMi'),
    category: [t('in-forge:plugins.azureFunctionApp.genCollections')],
    min: 0,
    formatter: number
  },
  {
    metric: 'g0c_mx',
    label: t('in-forge:plugins.azureFunctionApp.labelG0cMx'),
    category: [t('in-forge:plugins.azureFunctionApp.genCollections')],
    min: 0,
    formatter: number
  },
  {
    metric: 'g0c_to',
    label: t('in-forge:plugins.azureFunctionApp.labelG0cTo'),
    category: [t('in-forge:plugins.azureFunctionApp.genCollections')],
    min: 0,
    formatter: number
  },

  {
    metric: 'g1c_co',
    label: t('in-forge:plugins.azureFunctionApp.labelG1cCo'),
    category: [t('in-forge:plugins.azureFunctionApp.genCollections')],
    min: 0,
    formatter: number
  },
  {
    metric: 'g1c_av',
    label: t('in-forge:plugins.azureFunctionApp.labelG1cAv'),
    category: [t('in-forge:plugins.azureFunctionApp.genCollections')],
    min: 0,
    formatter: number
  },
  {
    metric: 'g1c_mi',
    label: t('in-forge:plugins.azureFunctionApp.labelG1cMi'),
    category: [t('in-forge:plugins.azureFunctionApp.genCollections')],
    min: 0,
    formatter: number
  },
  {
    metric: 'g1c_mx',
    label: t('in-forge:plugins.azureFunctionApp.labelG1cMx'),
    category: [t('in-forge:plugins.azureFunctionApp.genCollections')],
    min: 0,
    formatter: number
  },
  {
    metric: 'g1c_to',
    label: t('in-forge:plugins.azureFunctionApp.labelG1cTo'),
    category: [t('in-forge:plugins.azureFunctionApp.genCollections')],
    min: 0,
    formatter: number
  },
  
  {
    metric: 'g2c_co',
    label: t('in-forge:plugins.azureFunctionApp.labelG2cCo'),
    category: [t('in-forge:plugins.azureFunctionApp.genCollections')],
    min: 0,
    formatter: number
  },
  {
    metric: 'g2c_av',
    label: t('in-forge:plugins.azureFunctionApp.labelG2cAv'),
    category: [t('in-forge:plugins.azureFunctionApp.genCollections')],
    min: 0,
    formatter: number
  },
  {
    metric: 'g2c_mi',
    label: t('in-forge:plugins.azureFunctionApp.labelG2cMi'),
    category: [t('in-forge:plugins.azureFunctionApp.genCollections')],
    min: 0,
    formatter: number
  },
  {
    metric: 'g2c_mx',
    label: t('in-forge:plugins.azureFunctionApp.labelG2cMx'),
    category: [t('in-forge:plugins.azureFunctionApp.genCollections')],
    min: 0,
    formatter: number
  },
  {
    metric: 'g2c_to',
    label: t('in-forge:plugins.azureFunctionApp.labelG2cTo'),
    category: [t('in-forge:plugins.azureFunctionApp.genCollections')],
    min: 0,
    formatter: number
  },


  {
    metric: 'ac_co',
    label: t('in-forge:plugins.azureFunctionApp.labelAcCo'),
    category: [t('in-forge:plugins.azureFunctionApp.system')],
    min: 0,
    formatter: number
  },
  {
    metric: 'ac_av',
    label: t('in-forge:plugins.azureFunctionApp.labelAcAv'),
    category: [t('in-forge:plugins.azureFunctionApp.system')],
    min: 0,
    formatter: number
  },
  {
    metric: 'ac_mi',
    label: t('in-forge:plugins.azureFunctionApp.labelAcMi'),
    category: [t('in-forge:plugins.azureFunctionApp.system')],
    min: 0,
    formatter: number
  },
  {
    metric: 'ac_mx',
    label: t('in-forge:plugins.azureFunctionApp.labelAcMx'),
    category: [t('in-forge:plugins.azureFunctionApp.system')],
    min: 0,
    formatter: number
  },
  
  {
    metric: 'ca_co',
    label: t('in-forge:plugins.azureFunctionApp.labelCaCo'),
    category: [t('in-forge:plugins.azureFunctionApp.system')],
    min: 0,
    formatter: number
  },
  {
    metric: 'ca_av',
    label: t('in-forge:plugins.azureFunctionApp.labelCaAv'),
    category: [t('in-forge:plugins.azureFunctionApp.system')],
    min: 0,
    formatter: number
  },
  {
    metric: 'ca_mi',
    label: t('in-forge:plugins.azureFunctionApp.labelCaMi'),
    category: [t('in-forge:plugins.azureFunctionApp.system')],
    min: 0,
    formatter: number
  },
  {
    metric: 'ca_mx',
    label: t('in-forge:plugins.azureFunctionApp.labelCaMx'),
    category: [t('in-forge:plugins.azureFunctionApp.system')],
    min: 0,
    formatter: number
  },
  {
    metric: 'ca_to',
    label: t('in-forge:plugins.azureFunctionApp.labelCaTo'),
    category: [t('in-forge:plugins.azureFunctionApp.system')],
    min: 0,
    formatter: number
  },

  {
    metric: 'hcs_co',
    label: t('in-forge:plugins.azureFunctionApp.labelHcsCo'),
    category: [t('in-forge:plugins.azureFunctionApp.system')],
    min: 0,
    formatter: number
  },
  {
    metric: 'hcs_av',
    label: t('in-forge:plugins.azureFunctionApp.labelHcsAv'),
    category: [t('in-forge:plugins.azureFunctionApp.system')],
    min: 0,
    formatter: number
  },
  {
    metric: 'hcs_mi',
    label: t('in-forge:plugins.azureFunctionApp.labelHcsMi'),
    category: [t('in-forge:plugins.azureFunctionApp.system')],
    min: 0,
    formatter: number
  },
  {
    metric: 'hcs_mx',
    label: t('in-forge:plugins.azureFunctionApp.labelHcsMx'),
    category: [t('in-forge:plugins.azureFunctionApp.system')],
    min: 0,
    formatter: number
  },
  {
    metric: 'hcs_to',
    label: t('in-forge:plugins.azureFunctionApp.labelHcsTo'),
    category: [t('in-forge:plugins.azureFunctionApp.system')],
    min: 0,
    formatter: number
  },

  {
    metric: 'fsu_co',
    label: t('in-forge:plugins.azureFunctionApp.labelFsuCo'),
    category: [t('in-forge:plugins.azureFunctionApp.system')],
    min: 0,
    formatter: bytes
  },
  {
    metric: 'fsu_av',
    label: t('in-forge:plugins.azureFunctionApp.labelFsuAv'),
    category: [t('in-forge:plugins.azureFunctionApp.system')],
    min: 0,
    formatter: bytes
  },
  {
    metric: 'fsu_mi',
    label: t('in-forge:plugins.azureFunctionApp.labelFsuMi'),
    category: [t('in-forge:plugins.azureFunctionApp.system')],
    min: 0,
    formatter: bytes
  },
  {
    metric: 'fsu_mx',
    label: t('in-forge:plugins.azureFunctionApp.labelFsuMx'),
    category: [t('in-forge:plugins.azureFunctionApp.system')],
    min: 0,
    formatter: bytes
  },
  {
    metric: 'fsu_to',
    label: t('in-forge:plugins.azureFunctionApp.labelFsuTo'),
    category: [t('in-forge:plugins.azureFunctionApp.system')],
    min: 0,
    formatter: number
  }
];
