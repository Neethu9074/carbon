/* eslint-env mocha */

import { expect } from 'chai';

import { merge } from 'in-subscription/getUnifiedMetricsMerger';
import { finishedProgress } from 'in-services/fixedObjects';

describe('in-subscription/getUnifiedMetricsMerger', () => {
  it('must merge to progress state', () => {
    const merged = merge([
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
    ]);
    expect(merged).to.deep.equal({
      progress: {
        loading: true,
        percentage: 0.5
      },
      errors: []
    });
  });

  it('must merge to indeterminate progress state', () => {
    const merged = merge([
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
    ]);
    expect(merged).to.deep.equal({
      progress: {
        loading: true
      },
      errors: []
    });
  });

  it('must merge to error state', () => {
    const merged = merge([
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
    ]);
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
    const merged = merge([
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
    ]);
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
