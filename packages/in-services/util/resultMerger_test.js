/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env mocha */

import { expect } from 'chai';

import { finishedProgress } from 'in-services/fixedObjects';
import { merge } from 'in-services/util/resultMerger';

describe('in-services/util/resultMerger', () => {
  it('must merge to progress state', () => {
    const merged = merge(
      [
        {
          progress: {
            percentage: 0.5,
            loading: true
          },
          errors: []
        },
        {
          progress: {
            percentage: 0.6,
            loading: true
          },
          errors: []
        },
        {
          progress: finishedProgress,
          time: 42,
          data: [],
          errors: []
        }
      ],
      mergeResultData
    );
    expect(merged).to.deep.equal({
      progress: {
        loading: true,
        percentage: 0.5
      },
      errors: []
    });
  });

  it('must merge to indeterminate progress state', () => {
    const merged = merge(
      [
        {
          progress: {
            percentage: 0.5,
            loading: true
          },
          errors: []
        },
        {
          progress: {
            loading: true
          },
          errors: []
        },
        {
          progress: finishedProgress,
          time: 42,
          data: [],
          errors: []
        }
      ],
      mergeResultData
    );
    expect(merged).to.deep.equal({
      progress: {
        loading: true
      },
      errors: []
    });
  });

  it('must merge to error state', () => {
    const merged = merge(
      [
        {
          progress: {
            percentage: 0.5,
            loading: true
          },
          errors: []
        },
        {
          progress: {
            loading: false
          },
          errors: []
        },
        {
          progress: {
            loading: false
          },
          errors: [
            {
              message: 'Error',
              code: 'CLIENT'
            }
          ]
        },
        {
          progress: finishedProgress,
          time: 42,
          data: [],
          errors: []
        }
      ],
      mergeResultData
    );
    expect(merged).to.deep.equal({
      progress: {
        loading: false
      },
      errors: [
        {
          message: 'Error',
          code: 'CLIENT'
        }
      ]
    });
  });

  it('must merge to finished state', () => {
    const merged = merge(
      [
        {
          progress: {
            loading: false
          },
          errors: [],
          time: 10,
          data: [
            {
              id: 'a'
            },
            {
              id: 'b'
            }
          ]
        },
        {
          progress: {
            loading: false
          },
          errors: [],
          time: 11,
          data: [
            {
              id: 'c'
            },
            {
              id: 'd'
            }
          ]
        }
      ],
      mergeResultData
    );
    expect(merged).to.deep.equal({
      progress: {
        loading: false
      },
      errors: [],
      time: 11,
      data: [
        {
          id: 'a'
        },
        {
          id: 'b'
        },
        {
          id: 'c'
        },
        {
          id: 'd'
        }
      ]
    });
  });
});

function mergeResultData(dataSets) {
  const merged = [];
  for (const data of dataSets) {
    merged.push(...data);
  }
  return merged;
}
