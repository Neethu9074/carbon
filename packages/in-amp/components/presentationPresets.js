/*
 * (c) Copyright IBM Corp. 2024
 * (c) Copyright Instana Inc.
 */

import { onPremLicenseInformationEnabled } from 'in-services/featureFlags';
import { t } from 'in-i18n';

const presets = [
  {
    presentation: 'distinct',
    label: t('in-amp:components.presentationPresets.distinct'),
    isDisabled: () => false
  },
  {
    presentation: 'cumulative',
    label: t('in-amp:components.presentationPresets.cumulative'),
    isDisabled: timeRange => {
      // Disable cumulated setting for on-premise scenarios
      if (onPremLicenseInformationEnabled) return true;
      else return 'this_month' !== timeRange && 'last_month' !== timeRange;
    }
  }
];

export default presets;
