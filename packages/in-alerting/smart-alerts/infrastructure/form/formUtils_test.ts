/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { getTitlePlaceholder, getDescriptionPlaceholder } from 'in-alerting/smart-alerts/infrastructure/form/formUtils';
import { t } from 'in-i18n';

describe('in-alerting/smart-alerts/infrastructure/form/formUtils.ts', () => {
  it('getTitlePlaceholder', () => {
    // GIVEN
    const titlePlaceholder = getTitlePlaceholder();

    // THEN
    expect(titlePlaceholder).toBe(
      t('in-alerting:smartAlerts.infrastructure.advancedModeContainer.properties.alertPropertiesTitlePlaceholder')
    );
  });

  it('getDescriptionPlaceholder', () => {
    // GIVEN
    const descriptionPlaceholder = getDescriptionPlaceholder();

    // THEN
    expect(descriptionPlaceholder).toBe(
      t('in-alerting:smartAlerts.infrastructure.advancedModeContainer.properties.alertPropertiesDescriptionPlaceholder')
    );
  });
});
