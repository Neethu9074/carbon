/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { t } from 'in-i18n';

export interface AdvancedBluePrint {
  type: string;
  name: string;
}

export const advancedBluePrintConfig: readonly Readonly<AdvancedBluePrint>[] = Object.freeze([
  {
    type: 'API',
    name: t('in-synthetics:dialog.createTest.advancedMode.bluePrint.apiName')
  }
  // {
  //   type: 'Browser',
  //   name: t('in-synthetics:dialog.createTest.advancedMode.bluePrint.browserName')
  // },
  // {
  //   type: 'Internet Services',
  //   name: t('in-synthetics:dialog.createTest.advancedMode.bluePrint.internetServicesName')
  // }
]);
