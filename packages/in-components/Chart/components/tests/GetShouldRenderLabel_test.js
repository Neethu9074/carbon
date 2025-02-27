/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

// eslint-disable-next-line no-restricted-imports
import { getShouldRenderLabel } from '../GetShouldRenderLabel';

describe('getShouldRenderLabel', () => {
  it('should return true when there are inputs and non-zero metrics', () => {
    const formModel = [
      {
        type: 'TAG_FILTER',
        name: 'log.level',
        operator: 'EQUALS',
        value: 'ERROR'
      }
    ];
    const facets = ['ERROR'];
    const axis = { metrics: [[[111111, 5]]] };
    const index = 0;

    expect(getShouldRenderLabel(formModel, facets, axis, index)).toBe(true);
  });

  it('should return false when metrics are all zero', () => {
    const formModel = [
      {
        type: 'TAG_FILTER',
        name: 'log.level',
        operator: 'EQUALS',
        value: 'ERROR'
      }
    ];
    const facets = ['ERROR'];
    const axis = { metrics: [[[111111, 0]]] };
    const index = 0;

    expect(getShouldRenderLabel(formModel, facets, axis, index)).toBe(false);
  });

  it('should return true when there are no inputs', () => {
    const formModel = [];
    const facets = [];
    const axis = { metrics: [[[11111, 0]]] };
    const index = 0;

    expect(getShouldRenderLabel(formModel, facets, axis, index)).toBe(true);
  });

  it('should return false when there are inputs but an empty metrics array', () => {
    const formModel = [
      {
        type: 'TAG_FILTER',
        name: 'log.level',
        operator: 'EQUALS',
        value: 'ERROR'
      }
    ];
    const facets = ['ERROR'];
    const axis = { metrics: [[]] };
    const index = 0;

    expect(getShouldRenderLabel(formModel, facets, axis, index)).toBe(false);
  });
  it('should return true when there are inputs and non-zero metrics at index 1', () => {
    const formModel = [
      {
        type: 'TAG_FILTER',
        name: 'log.level',
        operator: 'EQUALS',
        value: 'ERROR'
      }
    ];
    const facets = [];
    const axis = { metrics: [[[11111, 10]], [[11111, 5]]] };
    const index = 1;

    expect(getShouldRenderLabel(formModel, facets, axis, index)).toBe(true);
  });
});
