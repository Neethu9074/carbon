/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { just } from '@instana/observables';

import { getViewStructure } from 'in-infrastructure/perspectives/viewStructureStore';
import { getItemsInAvailabilityZone } from 'in-sdk/getItemsInAvailabilityZone';
import { toPromise } from 'in-test/util/observables';

jest.mock('in-infrastructure/perspectives/viewStructureStore');

describe('in-sdk/getItemsInAvailabilityZone', () => {
  it('must work when the availability zone could not be found', async () => {
    getViewStructure.mockReturnValue(
      just({
        viewStructure: {
          children: [
            {
              id: '42'
            }
          ]
        }
      })
    );

    const result = await toPromise(getItemsInAvailabilityZone('missing id'));
    expect(result).toEqual([]);
  });
});
