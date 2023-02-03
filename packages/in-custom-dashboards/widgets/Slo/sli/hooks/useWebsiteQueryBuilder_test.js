/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import { renderHook } from '@testing-library/react-hooks';

import { just } from '@instana/observables';

import {
  useValidateWebsiteFilterExpression,
  useWebsiteQueryBuilder
} from 'in-custom-dashboards/widgets/Slo/sli/hooks/useWebsiteQueryBuilder';
import emptyTagFilterExpression from 'in-components/QueryBuilder/tagFilter/emptyTagFilterExpression';
import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import { getSuggestions as getWebsiteSuggestions } from 'in-websites/queryBuilder';
import { getTagCatalog as getWebsiteTagCatalog } from 'in-websites/api/tagCatalog';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { createQueryBuilder } from 'in-components/QueryBuilder';
import { success } from 'in-services/util/result';
import { days } from 'in-services/time/time';

jest.mock('in-websites/queryBuilder', () => ({
  ...jest.requireActual('in-websites/queryBuilder'),
  __esModule: true,
  getSuggestions: jest.fn()
}));

jest.mock('in-websites/api/tagCatalog', () => ({
  getTagCatalog: jest.fn()
}));

jest.mock('in-components/QueryBuilder', () => ({
  ...jest.requireActual('in-components/QueryBuilder'),
  __esModule: true,
  createQueryBuilder: jest.fn()
}));

describe('in-custom-dashboards/widgets/Slo/sli/hooks/useWebsiteQueryBuilder', () => {
  beforeEach(jest.clearAllMocks);

  describe('useWebsiteQueryBuilder', () => {
    it('applies a filter for the provided websiteId and beaconType to the returned QueryBuilders suggestions', () => {
      // Given
      const websiteId = 'someId';
      const beaconType = 'httpRequest';
      const useCase = 'SLI_MANAGEMENT';

      // When
      renderHook(() =>
        useWebsiteQueryBuilder({
          websiteId,
          beaconType
        })
      );

      const { getSuggestions, getTagCatalog } = createQueryBuilder.mock.calls.at(-1)[0];

      getSuggestions({
        tagFilterExpression: emptyTagFilterExpression,
        tagName: 'someTag',
        entity: 'DESTINATION',
        name: 'someName',
        timeConfig: { windowSize: 111, autoRefresh: false },
        key: 'someKey',
        propose: 'VALUES'
      });
      getTagCatalog({ timeConfig: { windowSize: days.toMillis(7), autoRefresh: false } });

      // Then
      expect(getWebsiteSuggestions).toHaveBeenLastCalledWith(
        expect.objectContaining({
          beaconType: 'httpRequest',
          entity: 'DESTINATION',
          key: 'someKey',
          name: 'someName',
          propose: 'VALUES',
          tagFilterExpression: {
            entity: 'NOT_APPLICABLE',
            name: 'beacon.website.id',
            operator: 'EQUALS',
            type: 'TAG_FILTER',
            value: 'someId'
          },
          tagName: 'someTag',
          timeConfig: { autoRefresh: false, windowSize: 111 }
        })
      );
      expect(getWebsiteTagCatalog).toHaveBeenLastCalledWith(expect.objectContaining({ beaconType, useCase }));
    });
    it('avoids unnecessary recreations of the QueryBuilder unless beaconType changes', async () => {
      // Given
      const websiteId = 'someId';
      const beaconType = 'httpRequest';

      // When
      const { rerender } = renderHook(useWebsiteQueryBuilder, { websiteId, beaconType });
      rerender({ beaconType, websiteId });
      rerender({ beaconType: 'foo', websiteId });

      // Then
      expect(createQueryBuilder).toBeCalledTimes(2);
    });
    it('avoids unnecessary recreations of the QueryBuilder unless websiteId changes', async () => {
      // Given
      const websiteId = 'someId';
      const beaconType = 'httpRequest';

      // When
      const { rerender } = renderHook(useWebsiteQueryBuilder, { websiteId, beaconType });
      rerender({ beaconType, websiteId });
      rerender({ beaconType, websiteId: 'foo' });

      // Then
      expect(createQueryBuilder).toBeCalledTimes(2);
    });
  });
  describe('useValidateWebsiteFilterExpression', () => {
    it('validates the filterExpression with the provided validator if it is not empty', () => {
      // Given
      const isQueryValid = jest.fn(() => just(success(false)));
      const filterExpression = fromBackendModel(tagFilter('snacks.available', 'IS_EMPTY'));

      // When
      const { result } = renderHook(() => useValidateWebsiteFilterExpression({ isQueryValid, filterExpression }));

      // Then
      expect(result.current).not.toBeTruthy();
      expect(isQueryValid).toHaveBeenLastCalledWith(filterExpression, expect.anything());
    });
  });
});
