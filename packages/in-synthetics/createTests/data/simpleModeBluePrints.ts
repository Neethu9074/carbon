/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { apiScriptTest, apiSimpleTest } from 'in-synthetics/utils/constants';
import { t } from 'in-i18n';

const whenToUse = t('in-synthetics:dialog.createTest.bluePrint.title');
const tipsForUsing = t('in-synthetics:dialog.createTest.bluePrint.apiSimple.tipsForUsing.title');

export const blueprintConfig: readonly Readonly<BluePrint>[] = Object.freeze([
  {
    type: apiSimpleTest,
    name: t('in-synthetics:dialog.createTest.bluePrint.apiSimple.name'),
    headline: t('in-synthetics:dialog.createTest.bluePrint.apiSimple.headline'),
    description: [
      {
        headline: whenToUse,
        htmlContent: t('in-synthetics:dialog.createTest.bluePrint.apiSimple.whenToUse.line1')
      },
      {
        headline: tipsForUsing,
        htmlContent: `
          <ul>
            <li>${t('in-synthetics:dialog.createTest.bluePrint.apiSimple.tipsForUsing.line1')}</li>
            <li>${t('in-synthetics:dialog.createTest.bluePrint.apiSimple.tipsForUsing.line2')}</li>
            <li>${t('in-synthetics:dialog.createTest.bluePrint.apiSimple.tipsForUsing.line3')}</li>
            <li>${t('in-synthetics:dialog.createTest.bluePrint.apiSimple.tipsForUsing.line4')}</li>
          </ul>
        `
      }
    ]
  },
  {
    type: apiScriptTest,
    name: t('in-synthetics:dialog.createTest.bluePrint.apiScript.name'),
    headline: t('in-synthetics:dialog.createTest.bluePrint.apiScript.headline'),
    description: [
      {
        headline: whenToUse,
        htmlContent: t('in-synthetics:dialog.createTest.bluePrint.apiScript.whenToUse.line1')
      },
      {
        headline: tipsForUsing,
        htmlContent: `
          <ul>
            <li>${t('in-synthetics:dialog.createTest.bluePrint.apiScript.tipsForUsing.line1')}</li>
            <li>${t('in-synthetics:dialog.createTest.bluePrint.apiScript.tipsForUsing.line2')}</li>
            <li>${t('in-synthetics:dialog.createTest.bluePrint.apiScript.tipsForUsing.line3')}</li>
            <li>${t('in-synthetics:dialog.createTest.bluePrint.apiScript.tipsForUsing.line4')}</li>
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
