/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import {
  getHeaderTitle,
  duplicateAlertConfig
} from 'in-alerting/smart-alerts/infrastructure/tearsheet/sharedFunctions';
import { InfraSmartAlertConfigWithMetadata } from 'in-alerting/smart-alerts/infrastructure/form/infraAlertConfigTypes';
import { alertConfig } from 'in-alerting/smart-alerts/infrastructure/tearsheet/alertConfig.json';
import { t } from 'in-i18n';

describe('getHeaderTitle', () => {
  it('returns the correct title when editMode is true', () => {
    expect(getHeaderTitle(true)).toBe(t('in-alerting:smartAlerts.infrastructure.tearSheet.editTitle'));
  });

  it('returns the correct title when editMode is false', () => {
    expect(getHeaderTitle(false)).toBe(t('in-alerting:smartAlerts.infrastructure.tearSheet.createTitle'));
  });
});

describe('duplicateAlertConfig', () => {
  it('should return a new object with duplicateFrom property set to the id of the original config', () => {
    // @ts-expect-error Type mismatch for json extracted from json
    const originalConfig: InfraSmartAlertConfigWithMetadata = alertConfig;

    const expectedResult: InfraSmartAlertConfigWithMetadata & { duplicateFrom?: string } = {
      ...originalConfig,
      duplicateFrom: originalConfig.id,
      name: t('in-alerting:smartAlerts.titleCopyOf', { smartAlertTitle: originalConfig.name })
    };

    expect(duplicateAlertConfig(originalConfig)).toEqual(expectedResult);
  });
});
