/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { t } from '@instana/i18n-react';

export interface LocationsBluePrint {
  type: string;
  name: string;
  headline: string;
  description: { headline: string; htmlContent: string }[];
}

const blueprintConfig: readonly Readonly<LocationsBluePrint>[] = Object.freeze([]);

const privateLocation: LocationsBluePrint = {
  type: 'private',
  name: t('in-synthetics:dialog.createLocation.privateLocation.name'),
  headline: t('in-synthetics:dialog.createLocation.privateLocation.headline'),
  description: [
    {
      headline: t('in-synthetics:dialog.createLocation.privateLocation.description.headline'),
      htmlContent: t('in-synthetics:dialog.createLocation.privateLocation.description.htmlContent')
    }
  ]
};

const managedLocation: LocationsBluePrint = {
  type: 'managed',
  name: t('in-synthetics:dialog.createLocation.managedLocation.name'),
  headline: t('in-synthetics:dialog.createLocation.managedLocation.headline'),
  description: [
    {
      headline: t('in-synthetics:dialog.createLocation.managedLocation.description.headline'),
      htmlContent: t('in-synthetics:dialog.createLocation.managedLocation.description.htmlContent')
    }
  ]
};

export const getLocationsBluePrintConfig = () => {
  return blueprintConfig.concat(privateLocation, managedLocation);
};
