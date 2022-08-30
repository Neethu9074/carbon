/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { number, bytes, seconds } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
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
