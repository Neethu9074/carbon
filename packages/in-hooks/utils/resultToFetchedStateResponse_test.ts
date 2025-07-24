/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { Error } from '@instana/types';

import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';

describe('in-hooks/utils/resultToFetchedStateResponse', () => {
  it('returns status "pending" while loading and erros list is empty.', () => {
    const [, status, errors] = resultToFetchedStateResponse({
      progress: {
        loading: true
      },
      errors: []
    });

    expect(status).toBe('pending');
    expect(errors).toHaveLength(0);
  });

  it('returns status "resolved" once a request is successfully resolved and errors list is empty', () => {
    const [, status, errors] = resultToFetchedStateResponse({
      progress: {
        loading: false
      },
      errors: []
    });

    expect(status).toBe('resolved');
    expect(errors).toHaveLength(0);
  });

  it('returns status "rejected" in case if errors list contains at least one item and is not pending.', () => {
    const error: Error = {
      code: 'NOT_FOUND',
      message: 'not found'
    };

    const [, status, errors] = resultToFetchedStateResponse({
      progress: {
        loading: false
      },
      errors: [error]
    });

    expect(status).toBe('rejected');
    expect(errors).toHaveLength(1);
    expect(errors).toContain(error);
  });
});
