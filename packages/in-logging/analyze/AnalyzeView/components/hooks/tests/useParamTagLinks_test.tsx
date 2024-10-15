/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { renderHook } from '@testing-library/react-hooks';
import { stringify } from 'qs';

import { useParamTagLinks } from 'in-logging/analyze/AnalyzeView/components/hooks/useParamTagLinks';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { cloneLocation } from 'in-stores/navigation/routing/clone';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { buildJsonSerializer } from 'in-stores/navigation/matrix';

jest.mock('in-stores/navigation/hooks/useNavigation');

jest.mock('in-stores/navigation/routing/clone');
jest.mock('in-stores/navigation/matrix');
jest.mock('in-logging/navigation/paths', () => ({
  logsPath: '/logs'
}));
jest.mock('in-components/QueryBuilder/transformation/formModel', () => ({
  TAG: 'TAG_FILTER'
}));
jest.mock('in-components/QueryBuilder/tagFilter/operators', () => ({
  EQUALS: 'EQUALS'
}));

describe('useParamTagLinks', () => {
  let mockCreateHref: jest.Mock;
  let mockLocation: any;
  let mockCloneLocation: jest.Mock;
  let mockSetOrDeleteMatrixKey: jest.Mock;
  let mockBuildJsonSerializer: jest.Mock;

  beforeEach(() => {
    mockCreateHref = jest.fn(loc => {
      const params = Object.entries(loc.matrixParams || {})
        .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
        .join(';');
      return `${loc.pathname};${params}`;
    });
    mockLocation = { pathname: '/current/path', search: '', hash: '', matrixParams: {} as { [key: string]: string } };
    (useNavigation as jest.Mock).mockReturnValue({
      createHref: mockCreateHref,
      location: mockLocation
    });

    mockCloneLocation = jest.fn().mockImplementation(loc => ({ ...loc, matrixParams: { ...loc.matrixParams } }));
    (cloneLocation as jest.Mock).mockImplementation(mockCloneLocation);

    mockSetOrDeleteMatrixKey = jest.fn((loc, _, key, value) => {
      if (!loc.matrixParams) {
        loc.matrixParams = {};
      }
      if (value === null) {
        delete loc.matrixParams[key];
      } else {
        loc.matrixParams[key] = value as string;
      }
    });
    (setOrDeleteMatrixKey as jest.Mock).mockImplementation(mockSetOrDeleteMatrixKey);

    mockBuildJsonSerializer = jest.fn().mockImplementation(() => (v: any) => {
      if (!v) {
        return undefined;
      }
      return stringify(v);
    });
    (buildJsonSerializer as jest.Mock).mockImplementation(mockBuildJsonSerializer);
  });

  it('should generate correct href for getHrefWithAdditionalTagFilter', () => {
    const { result } = renderHook(() => useParamTagLinks());

    const name = 'log.custom';
    const key = '**_msg*_param0';
    const value = '*170.225.223.19';

    const href = result.current.getHrefWithAdditionalTagFilter(name, key, value);

    expect(mockCloneLocation).toHaveBeenCalledWith(mockLocation);
    expect(mockSetOrDeleteMatrixKey).toHaveBeenCalledWith(expect.any(Object), '/logs', 'dataSource', 'logs');
    expect(mockSetOrDeleteMatrixKey).toHaveBeenCalledWith(expect.any(Object), '/logs', 'detailId', null);
    expect(mockSetOrDeleteMatrixKey).toHaveBeenCalledWith(expect.any(Object), '/logs', 'groupBy', null);
    expect(mockSetOrDeleteMatrixKey).toHaveBeenCalledWith(expect.any(Object), '/logs', 'orderBy', null);
    expect(mockSetOrDeleteMatrixKey).toHaveBeenCalledWith(expect.any(Object), '/logs', 'metrics', null);

    const expectedTagFilterExpression = mockBuildJsonSerializer()([
      {
        key,
        value,
        name,
        type: 'TAG_FILTER',
        operator: 'EQUALS',
        entity: 'NOT_APPLICABLE'
      }
    ]);

    expect(mockSetOrDeleteMatrixKey).toHaveBeenCalledWith(
      expect.any(Object),
      '/logs',
      'tagFilterExpression',
      expectedTagFilterExpression
    );

    const expectedHref = `/logs;dataSource=logs;tagFilterExpression=${encodeURIComponent(expectedTagFilterExpression)}`;
    expect(href).toEqual(expectedHref);
  });

  it('should generate correct href for getHrefToGroupedView', () => {
    const { result } = renderHook(() => useParamTagLinks());

    const tagName = 'log.custom';
    const secondLevelKey = '**_msg*_param0';

    const href = result.current.getHrefToGroupedView(tagName, secondLevelKey);

    expect(mockCloneLocation).toHaveBeenCalledWith(mockLocation);
    expect(mockSetOrDeleteMatrixKey).toHaveBeenCalledWith(expect.any(Object), '/logs', 'dataSource', 'logs');
    expect(mockSetOrDeleteMatrixKey).toHaveBeenCalledWith(expect.any(Object), '/logs', 'detailId', null);
    expect(mockSetOrDeleteMatrixKey).toHaveBeenCalledWith(expect.any(Object), '/logs', 'orderBy', null);
    expect(mockSetOrDeleteMatrixKey).toHaveBeenCalledWith(expect.any(Object), '/logs', 'metrics', null);

    const expectedGroupBy = mockBuildJsonSerializer()({
      groupbyTag: tagName,
      groupbyTagSecondLevelKey: secondLevelKey
    });

    expect(mockSetOrDeleteMatrixKey).toHaveBeenCalledWith(expect.any(Object), '/logs', 'groupBy', expectedGroupBy);
    const expectedHref = `/logs;dataSource=logs;groupBy=${encodeURIComponent(expectedGroupBy)}`;
    expect(href).toEqual(expectedHref);
  });
});
