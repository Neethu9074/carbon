/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { SyntheticAlertConfigWithMetadata } from '@instana/types';

import { getHeaderTitle, duplicateAlertConfig } from 'in-alerting/smart-alerts/synthetics/tearsheet/sharedFunctions';
import { alertConfig } from 'in-alerting/smart-alerts/synthetics/data/alertConfig.json';
import { t } from 'in-i18n';

describe('getHeaderTitle', () => {
  it('Check if correct title is returned when editMode is true', () => {
    expect(getHeaderTitle(true)).toBe(t('in-alerting:smartAlerts.synthetics.tearSheet.editTitle'));
  });

  it('Check if correct title is returned when editMode is false', () => {
    expect(getHeaderTitle(false)).toBe(t('in-alerting:smartAlerts.synthetics.tearSheet.createTitle'));
  });
});

describe('duplicateAlertConfig', () => {
  it('Check if the function return the correct config with duplicateFrom prop and modified name', () => {
    // @ts-expect-error Type mismatch for json extracted from json
    const originalConfig: SyntheticAlertConfigWithMetadata = alertConfig;

    const expectedResult: SyntheticAlertConfigWithMetadata & { duplicateFrom?: string } = {
      ...originalConfig,
      duplicateFrom: originalConfig.id,
      name: t('in-alerting:smartAlerts.titleCopyOf', { smartAlertTitle: originalConfig.name })
    };

    expect(duplicateAlertConfig(originalConfig)).toEqual(expectedResult);
  });
});
