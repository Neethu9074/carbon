/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { syntheticBrowserScriptEnabled } from 'in-services/featureFlags';
import { t } from 'in-i18n';

export interface AdvancedBluePrint {
  type: string;
  name: string;
  label?: string;
  description: { headline: string; text: string };
  testType?: string;
  isBeta?: boolean;
}

const apiBlueprint: AdvancedBluePrint = {
  type: 'API',
  name: t('in-synthetics:dialog.createTest.advancedMode.advancedBluePrint.apiName'),
  label: t('in-synthetics:dialog.createTest.advancedMode.testTypeSection.apiTypeLabel'),
  description: {
    headline: t('in-synthetics:dialog.createTest.advancedMode.testTypeSection.apiTypeHeadline'),
    text: t('in-synthetics:dialog.createTest.advancedMode.testTypeSection.apiTypeText')
  },
  testType: ''
};

const browserBlueprint: AdvancedBluePrint = {
  type: 'Browser',
  name: t('in-synthetics:dialog.createTest.advancedMode.advancedBluePrint.browserName'),
  label: t('in-synthetics:dialog.createTest.advancedMode.testTypeSection.browserTypeLabel'),
  description: {
    headline: t('in-synthetics:dialog.createTest.advancedMode.testTypeSection.browserTypeHeadline'),
    text: t('in-synthetics:dialog.createTest.advancedMode.testTypeSection.browserTypeText')
  },
  isBeta: syntheticBrowserScriptEnabled
};

const advancedBluePrintConfig: readonly Readonly<AdvancedBluePrint>[] = Object.freeze([]);

export const getAdvancedBlueprintConfig = (isBrowserEnabled: boolean) => {
  if (isBrowserEnabled) {
    return advancedBluePrintConfig.concat(apiBlueprint, browserBlueprint);
  }
  return advancedBluePrintConfig.concat(apiBlueprint);
};
