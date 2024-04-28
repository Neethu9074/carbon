/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.syntheticPoP.httpActive'),
    metric: 'http.activeTests',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.syntheticPoP.javascriptActive'),
    metric: 'javascript.activeTests',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.syntheticPoP.browserActive'),
    metric: 'browserscript.activeTests',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.syntheticPoP.ismActive'),
    metric: 'ism.activeTests',
    formatter: number.compact
  }
];
