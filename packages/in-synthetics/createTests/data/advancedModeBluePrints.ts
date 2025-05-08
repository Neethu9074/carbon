/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { syntheticDnsEnabled } from 'in-services/featureFlags';
import { t } from 'in-i18n';

export interface AdvancedBluePrint {
  type: string;
  name: string;
  label?: string;
  description: { headline: string; text: string };
  testType?: string;
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
  }
};

const certificateCheckBlueprint: AdvancedBluePrint = {
  type: 'Certificate Check',
  name: t('in-synthetics:dialog.createTest.advancedMode.advancedBluePrint.certificateCheckName'),
  label: t('in-synthetics:dialog.createTest.advancedMode.testTypeSection.certificateCheckLabel'),
  description: {
    headline: t('in-synthetics:dialog.createTest.advancedMode.testTypeSection.certificateCheckHeadline'),
    text: t('in-synthetics:dialog.createTest.advancedMode.testTypeSection.certificateCheckText')
  },
  testType: ''
};

const dnsBlueprint: AdvancedBluePrint = {
  type: 'DNS',
  name: t('in-synthetics:dialog.createTest.advancedMode.advancedBluePrint.dnsName'),
  label: t('in-synthetics:dialog.createTest.advancedMode.testTypeSection.dnsLabel'),
  description: {
    headline: t('in-synthetics:dialog.createTest.advancedMode.testTypeSection.dnsHeadline'),
    text: t('in-synthetics:dialog.createTest.advancedMode.testTypeSection.dnsText')
  },
  testType: ''
};

const advancedBluePrintConfig: readonly Readonly<AdvancedBluePrint>[] = Object.freeze([]);

export const getAdvancedBlueprintConfig = () => {
  return syntheticDnsEnabled
    ? advancedBluePrintConfig.concat(apiBlueprint, browserBlueprint, certificateCheckBlueprint, dnsBlueprint)
    : advancedBluePrintConfig.concat(apiBlueprint, browserBlueprint, certificateCheckBlueprint);
};
