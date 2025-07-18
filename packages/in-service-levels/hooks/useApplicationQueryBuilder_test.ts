/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { renderHook } from '@testing-library/react-hooks';

import { just } from '@instana/observables';

import {
  useApplicationQueryBuilder,
  useValidateApplicationFilterExpression
} from 'in-service-levels/hooks/useApplicationQueryBuilder';
import emptyTagFilterExpression from 'in-components/QueryBuilder/tagFilter/emptyTagFilterExpression';
import type { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import getTagSuggestions from 'in-applications/subscriptions/getTagSuggestions';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { createQueryBuilder as cQB } from 'in-components/QueryBuilder';
import { emptyArray } from 'in-services/fixedObjects';
import { success } from 'in-services/util/result';

jest.mock('in-applications/subscriptions/getTagSuggestions', () => ({
  __esModule: true,
  default: jest.fn()
}));
jest.mock('in-components/QueryBuilder', () => ({
  createQueryBuilder: jest.fn(() => ({
    QueryBuilder: jest.fn(),
    isCallQueryValid: true,
    getTagCatalog: jest.fn()
  }))
}));

const createQueryBuilder = cQB as jest.MockedFunction<typeof cQB>;

describe('in-service-levels/hooks/useApplicationQueryBuilder', () => {
  beforeEach(jest.clearAllMocks);

  describe('useApplicationQueryBuilder', () => {
    it('applies a filter for the provided applicationId and boundaryScope to the returned QueryBuilders suggestions', () => {
      // Given
      const applicationId = 'stansLab';
      const boundaryScope = 'INBOUND';

      // When
      renderHook(() =>
        useApplicationQueryBuilder({
          applicationId,
          boundaryScope
        })
      );
      const { getSuggestions } = createQueryBuilder.mock.calls.at(-1)![0];
      getSuggestions?.({
        tagFilterExpression: emptyTagFilterExpression,
        tagName: 'someTag',
        entity: 'DESTINATION',
        name: 'someName',
        timeConfig: { windowSize: 111, autoRefresh: false },
        key: 'someKey',
        propose: 'VALUES'
      });

      // Then
      expect(getTagSuggestions).toHaveBeenLastCalledWith(
        expect.objectContaining({
          entity: 'DESTINATION',
          tagName: 'someName', // For some reason this is using the name from the props instead of the tagName
          secondLevelKeyTagName: 'someKey',
          filter: expect.objectContaining({
            timeConfig: { windowSize: 111, autoRefresh: false }
          }),
          tagFilterExpression: expect.objectContaining({
            name: 'boundary.application.id',
            value: applicationId
          })
        })
      );
    });

    it('applies no additional filter to the returned QueryBuilders suggestions if no applicationId is provided', () => {
      // Given
      const props = {};

      // When
      renderHook(() => useApplicationQueryBuilder(props));
      const { getSuggestions } = createQueryBuilder.mock.calls.at(-1)![0];
      getSuggestions?.({
        tagFilterExpression: emptyTagFilterExpression,
        tagName: 'someTag',
        entity: 'DESTINATION',
        name: 'someName',
        timeConfig: { windowSize: 111, autoRefresh: false },
        key: 'someKey',
        propose: 'VALUES'
      });

      // Then
      expect(getTagSuggestions).toHaveBeenLastCalledWith(
        expect.objectContaining({
          tagFilterExpression: expect.objectContaining(emptyTagFilterExpression)
        })
      );
    });

    it('uses the DEFAULT boundaryScope if none is provided to filter suggestions', () => {
      // Given
      const applicationId = 'stansLab';

      // When
      renderHook(() =>
        useApplicationQueryBuilder({
          applicationId
        })
      );
      const { getSuggestions } = createQueryBuilder.mock.calls.at(-1)![0];
      getSuggestions?.({
        tagFilterExpression: emptyTagFilterExpression,
        tagName: 'someTag',
        entity: 'DESTINATION',
        name: 'someName',
        timeConfig: { windowSize: 111, autoRefresh: false },
        key: 'someKey',
        propose: 'VALUES'
      });

      // Then
      expect(getTagSuggestions).toHaveBeenLastCalledWith(
        expect.objectContaining({
          entity: 'DESTINATION',
          tagName: 'someName', // For some reason this is using the name from the props instead of the tagName
          secondLevelKeyTagName: 'someKey',
          filter: expect.objectContaining({
            timeConfig: { windowSize: 111, autoRefresh: false }
          }),
          tagFilterExpression: expect.objectContaining({
            name: 'application.id',
            value: applicationId
          })
        })
      );
    });

    it('avoids unnecessary recreations of the QueryBuilder unless applicationId changes', () => {
      // Given
      const applicationId = 'stansLab';

      // When
      const { rerender } = renderHook(useApplicationQueryBuilder, { initialProps: { applicationId } });
      rerender({ applicationId });
      rerender({ applicationId: 'stansOtherLab' });

      // Then
      expect(createQueryBuilder).toHaveBeenCalledTimes(2);
    });

    it('avoids unnecessary recreations of the QueryBuilder unless boundaryScope changes', () => {
      // Given
      const applicationId = 'stansLab';
      const boundaryScope = 'ALL';

      // When
      const { rerender } = renderHook(useApplicationQueryBuilder, { initialProps: { applicationId, boundaryScope } });
      rerender({ applicationId, boundaryScope });
      rerender({ applicationId, boundaryScope: 'INBOUND' });

      // Then
      expect(createQueryBuilder).toHaveBeenCalledTimes(2);
    });
  });

  describe('useValidateAppplicationFilterExpression', () => {
    it.each([[undefined], [emptyArray]])('always returns a truthy result if filter expression is %s', filter => {
      // Given
      const isQueryValid = jest.fn();
      const filterExpression = filter as FormModelElement[] | undefined;

      // When
      const { result } = renderHook(() => useValidateApplicationFilterExpression({ isQueryValid, filterExpression }));

      expect(result.current).toBeTruthy();
      expect(isQueryValid).not.toHaveBeenCalled();
    });

    it('validates the filterExpression with the provided validator if it is not empty', () => {
      // Given
      const isQueryValid = jest.fn(() => just(success(false)));
      const filterExpression = fromBackendModel(tagFilter('snacks.available', 'IS_EMPTY'));

      // When
      const { result } = renderHook(() => useValidateApplicationFilterExpression({ isQueryValid, filterExpression }));

      expect(result.current).not.toBeTruthy();
      expect(isQueryValid).toHaveBeenLastCalledWith(filterExpression, expect.anything());
    });
  });
});
