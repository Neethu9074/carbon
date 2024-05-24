/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { apiScriptTest, apiSimpleTest, browserSimpleTest, browserScriptTest } from 'in-synthetics/utils/constants';
import { t } from 'in-i18n';

const whenToUse = t('in-synthetics:dialog.createTest.bluePrint.title');
const tipsForUsing = t('in-synthetics:dialog.createTest.bluePrint.apiSimple.tipsForUsing.title');

const apiSimple: BluePrint = {
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
};

const apiScript: BluePrint = {
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
};

const browserSimple: BluePrint = {
  type: browserSimpleTest,
  name: t('in-synthetics:dialog.createTest.bluePrint.browserSimple.name'),
  headline: t('in-synthetics:dialog.createTest.bluePrint.browserSimple.headline'),
  description: [
    {
      headline: whenToUse,
      htmlContent: t('in-synthetics:dialog.createTest.bluePrint.browserSimple.whenToUse.line1')
    },
    {
      headline: tipsForUsing,
      htmlContent: `
        <ul>
          <li>${t('in-synthetics:dialog.createTest.bluePrint.browserSimple.tipsForUsing.line1')}</li>
          <li>${t('in-synthetics:dialog.createTest.bluePrint.browserSimple.tipsForUsing.line2')}</li>
          <li>${t('in-synthetics:dialog.createTest.bluePrint.browserSimple.tipsForUsing.line3')}</li>
          <li>${t('in-synthetics:dialog.createTest.bluePrint.browserSimple.tipsForUsing.line4')}</li>
        </ul>
      `
    }
  ]
};

const browserScript: BluePrint = {
  type: browserScriptTest,
  name: t('in-synthetics:dialog.createTest.bluePrint.browserScript.name'),
  headline: t('in-synthetics:dialog.createTest.bluePrint.browserScript.headline'),
  description: [
    {
      headline: whenToUse,
      htmlContent: t('in-synthetics:dialog.createTest.bluePrint.browserScript.whenToUse.line1')
    },
    {
      headline: tipsForUsing,
      htmlContent: `
        <ul>
          <li>${t('in-synthetics:dialog.createTest.bluePrint.browserScript.tipsForUsing.line1')}</li>
          <li>${t('in-synthetics:dialog.createTest.bluePrint.browserScript.tipsForUsing.line2')}</li>
          <li>${t('in-synthetics:dialog.createTest.bluePrint.browserScript.tipsForUsing.line3')}</li>
          <li>${t('in-synthetics:dialog.createTest.bluePrint.browserScript.tipsForUsing.line4')}</li>
        </ul>
      `
    }
  ]
};

const blueprintConfig: readonly Readonly<BluePrint>[] = Object.freeze([]);

export interface BluePrint {
  type: string;
  name: string;
  headline: string;
  description: { headline: string; htmlContent: string }[];
}

export const getSimpleBlueprintConfig = () => {
  return blueprintConfig.concat(apiSimple, apiScript, browserSimple, browserScript);
};
