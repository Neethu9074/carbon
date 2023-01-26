/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { t } from 'in-i18n';

const whenToUse = t('in-synthetics:dialog.createTest.bluePrint.pingApi.whenToUse.title');
const tipsForUsing = t('in-synthetics:dialog.createTest.bluePrint.pingApi.tipsForUsing.title');

export const blueprintConfig: readonly BluePrint[] = Object.freeze([
  {
    type: 'Ping API',
    name: t('in-synthetics:dialog.createTest.bluePrint.pingApi.name'),
    headline: t('in-synthetics:dialog.createTest.bluePrint.pingApi.headline'),
    description: [
      {
        headline: whenToUse,
        htmlContent: t('in-synthetics:dialog.createTest.bluePrint.pingApi.whenToUse.line1')
      },
      {
        headline: tipsForUsing,
        htmlContent: `
          <ul>
            <li>${t('in-synthetics:dialog.createTest.bluePrint.pingApi.tipsForUsing.line1')}</li>
            <li>${t('in-synthetics:dialog.createTest.bluePrint.pingApi.tipsForUsing.line2')}</li>
            <li>${t('in-synthetics:dialog.createTest.bluePrint.pingApi.tipsForUsing.line3')}</li>
            <li>${t('in-synthetics:dialog.createTest.bluePrint.pingApi.tipsForUsing.line4')}</li>
          </ul>
        `
      }
    ]
  },
  {
    type: 'Script API',
    name: t('in-synthetics:dialog.createTest.bluePrint.scriptApi.name'),
    headline: t('in-synthetics:dialog.createTest.bluePrint.scriptApi.headline'),
    description: [
      {
        headline: whenToUse,
        htmlContent: t('in-synthetics:dialog.createTest.bluePrint.scriptApi.whenToUse.line1')
      },
      {
        headline: tipsForUsing,
        htmlContent: `
          <ul>
            <li>${t('in-synthetics:dialog.createTest.bluePrint.scriptApi.tipsForUsing.line1')}</li>
            <li>${t('in-synthetics:dialog.createTest.bluePrint.scriptApi.tipsForUsing.line2')}</li>
            <li>${t('in-synthetics:dialog.createTest.bluePrint.scriptApi.tipsForUsing.line3')}</li>
            <li>${t('in-synthetics:dialog.createTest.bluePrint.scriptApi.tipsForUsing.line4')}</li>
          </ul>
        `
      }
    ]
  }
]);

export interface BluePrint {
  type: string;
  name: string;
  headline: string;
  description: { headline: string; htmlContent: string }[];
}
