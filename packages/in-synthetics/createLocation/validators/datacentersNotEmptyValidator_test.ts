/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { datacentersNotEmptyValidator } from 'in-synthetics/createLocation/validators/datacentersnotEmptyValidator';
import { t } from 'in-i18n';

describe('datacentersNotEmptyValidator', () => {
  it('returns an error message when datacenters array is empty', () => {
    const result = datacentersNotEmptyValidator([]);

    expect(result).toEqual([
      {
        severity: 'error',
        message: t('in-synthetics:dialog.createLocation.validators.theValueMustNotBeEmpty')
      }
    ]);
  });

  it('returns null when datacenters array is not empty', () => {
    const result = datacentersNotEmptyValidator([
      {
        cityName: 'NCalifornia',
        code: 'us-west-1',
        countryName: 'USA',
        label: 'us-west-1(NCalifornia)',
        latitude: 50.11,
        longitude: 8.68,
        provider: 'aws',
        status: 'Inactive'
      }
    ]);

    expect(result).toBeNull();
  });
});
