/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['totalIPCQnum', 'numOfSvrs', 'numOfSvcs', 'numOfReqQues', 'numOfSrvGrps'],
    labels: [
      t('in-forge:plugins.tuxedoDomain.totNumOfIPCMsgs'),
      t('in-forge:plugins.tuxedoDomain.numOfSvrs'),
      t('in-forge:plugins.tuxedoDomain.numOfSvcs'),
      t('in-forge:plugins.tuxedoDomain.numOfReqQues'),
      t('in-forge:plugins.tuxedoDomain.numOfSrvGrps'),
      t('in-forge:plugins.tuxedoDomain.numOfIntfs')
    ],
    min: 0,
    category: [t('in-forge:plugins.tuxedoDomain.domain')],
    formatter: number
  }
];
