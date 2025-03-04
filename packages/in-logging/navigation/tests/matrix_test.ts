/*
 * (c) Copyright IBM Corp. 2024
 * (c) Copyright Instana Inc.
 */

import {
  groupByMatrixParameter,
  orderByMatrixParameter,
  tagFilterExpressionMatrixParameter
} from 'in-applications/navigation/matrix';
import { alertCreated, alertId, dataSource, logIdMatrixParameter } from 'in-logging/navigation/matrix';
import { logsPath } from 'in-logging/navigation/paths';
import { emptyArray } from 'in-services/fixedObjects';

jest.mock('in-stores/navigation/matrix', () => ({
  buildJsonSerializer: jest.fn(() => jest.fn(JSON.stringify)),
  buildJsonParser: jest.fn(() => jest.fn(JSON.parse))
}));

describe('Matrix Parameters', () => {
  it('should correctly define tagFilterExpressionMatrixParameter', () => {
    expect(tagFilterExpressionMatrixParameter).toEqual({
      path: '/analyze',
      name: 'tagFilterExpression',
      serializer: expect.any(Function),
      parser: expect.any(Function),
      initialState: emptyArray
    });
    expect(tagFilterExpressionMatrixParameter.serializer('test')).toBe(JSON.stringify('test'));
    expect(tagFilterExpressionMatrixParameter.parser('{}')).toEqual(JSON.parse('{}'));
  });

  it('should correctly define groupByMatrixParameter', () => {
    expect(groupByMatrixParameter).toEqual({
      path: '/analyze',
      name: 'groupBy',
      serializer: expect.any(Function),
      parser: expect.any(Function)
    });
  });

  it('should correctly define orderByMatrixParameter', () => {
    expect(orderByMatrixParameter).toEqual({
      path: '/analyze',
      name: 'orderBy',
      serializer: expect.any(Function),
      parser: expect.any(Function),
      initialState: { by: 'latency', direction: 'DESC' }
    });
  });

  it('should correctly define logIdMatrixParameter', () => {
    expect(logIdMatrixParameter).toEqual({
      path: logsPath,
      name: 'logId'
    });
  });

  it('should have correct constant values', () => {
    expect(dataSource).toBe('dataSource');
    expect(alertId).toBe('alertId');
    expect(alertCreated).toBe('alertCreated');
  });
});
