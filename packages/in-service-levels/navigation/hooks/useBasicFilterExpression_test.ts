/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { renderHook } from '@testing-library/react-hooks';

import { ApplicationSloEntity, WebsiteSloEntity } from '@instana/types';
import { just } from '@instana/observables';

import useBasicTagFilterExpression from 'in-service-levels/navigation/hooks/useBasicFilterExpression';
import getEndpointInfoOriginal from 'in-applications/subscriptions/getEndpointInfo';
import getServiceLabelOriginal from 'in-applications/subscriptions/getServiceLabel';
import getApplicationOriginal from 'in-applications/subscriptions/getApplication';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import getWebsiteOriginal from 'in-websites/subscriptions/getWebsite';
import { success } from 'in-services/util/result';

jest.mock('in-applications/subscriptions/getEndpointInfo');
const getEndpointInfo = getEndpointInfoOriginal as jest.MockedFunction<typeof getEndpointInfoOriginal>;

jest.mock('in-applications/subscriptions/getServiceLabel');
const getServiceLabel = getServiceLabelOriginal as jest.MockedFunction<typeof getServiceLabelOriginal>;

jest.mock('in-applications/subscriptions/getApplication');
const getApplication = getApplicationOriginal as jest.MockedFunction<typeof getApplicationOriginal>;

jest.mock('in-websites/subscriptions/getWebsite');
const getWebsite = getWebsiteOriginal as jest.MockedFunction<typeof getWebsiteOriginal>;

describe('in-service-levels/navigation/hooks/useBasicFilterExpression', () => {
  beforeAll(() => {
    jest.resetAllMocks();
    getApplication.mockReturnValue(
      just(
        success({
          label: 'Snacktastic',
          boundaryScope: 'ALL',
          id: 'snackTasticAppId'
        })
      )
    );

    getServiceLabel.mockReturnValue(
      just(
        success({
          label: 'Shopping cart',
          id: 'shoppingCartId'
        })
      )
    );

    getEndpointInfo.mockReturnValue(
      just(
        success({
          id: 'purchaseSnackId',
          label: 'Purchase snack',
          serviceId: 'shoppingCartId',
          technologies: [],
          type: 'HTTP' as const
        })
      )
    );

    getWebsite.mockReturnValue(
      just(
        success({
          label: 'GigaGiggles',
          id: 'gigaGigglesWebsiteId'
        })
      )
    );
  });

  describe('Filtering by internal IDs', () => {
    it('returns a TagFilterExpression for application entity with configured endpoint and service ID', () => {
      // Given
      const entity: ApplicationSloEntity = {
        type: 'application',
        boundaryScope: 'ALL',
        applicationId: 'snackTasticAppId',
        endpointId: 'purchaseSnackId',
        serviceId: 'shoppingCartId'
      };

      // When
      const { result } = renderHook(() => useBasicTagFilterExpression({ entity }));

      // Then
      expect(result.current.type).toEqual('EXPRESSION');
      expect(result.current.logicalOperator).toEqual('AND');
      expect(result.current.elements).toContainEqual({
        entity: 'DESTINATION',
        name: 'application.id',
        operator: 'EQUALS',
        type: 'TAG_FILTER',
        value: 'snackTasticAppId'
      });
      expect(result.current.elements).toContainEqual({
        entity: 'DESTINATION',
        name: 'service.id',
        operator: 'EQUALS',
        type: 'TAG_FILTER',
        value: 'shoppingCartId'
      });
      expect(result.current.elements).toContainEqual({
        entity: 'DESTINATION',
        name: 'endpoint.id',
        operator: 'EQUALS',
        type: 'TAG_FILTER',
        value: 'purchaseSnackId'
      });
    });

    it('returns a TagFilterExpression for application entity without endpoint and service ID', () => {
      // Given
      const entity: ApplicationSloEntity = {
        type: 'application',
        boundaryScope: 'ALL',
        applicationId: 'snackTasticAppId',
        endpointId: 'purchaseSnackId',
        serviceId: 'shoppingCartId'
      };

      // When
      const { result } = renderHook(() => useBasicTagFilterExpression({ entity }));

      // Then
      expect(result.current.type).toEqual('EXPRESSION');
      expect(result.current.logicalOperator).toEqual('AND');
      expect(result.current.elements).toContainEqual({
        entity: 'DESTINATION',
        name: 'application.id',
        operator: 'EQUALS',
        type: 'TAG_FILTER',
        value: 'snackTasticAppId'
      });
    });

    it('returns a TagFilterExpression for website entity', () => {
      // Given
      const entity: WebsiteSloEntity = {
        type: 'website',
        beaconType: 'httpRequest',
        websiteId: 'gigaGigglesWebsiteId'
      };

      // When
      const { result } = renderHook(() => useBasicTagFilterExpression({ entity }));

      // Then
      expect(result.current.type).toEqual('EXPRESSION');
      expect(result.current.logicalOperator).toEqual('AND');
      expect(result.current.elements).toContainEqual({
        entity: 'NOT_APPLICABLE',
        name: 'beacon.website.id',
        operator: 'EQUALS',
        type: 'TAG_FILTER',
        value: 'gigaGigglesWebsiteId'
      });
    });
  });

  describe('Filtering by labels', () => {
    it('returns a TagFilterExpression for application entity with configured endpoint and service ID', () => {
      // Given
      const withLabels = true;

      const entity: ApplicationSloEntity = {
        type: 'application',
        boundaryScope: 'ALL',
        applicationId: 'snackTasticAppId',
        endpointId: 'purchaseSnackId',
        serviceId: 'shoppingCartId'
      };

      // When
      const { result } = renderHook(() => useBasicTagFilterExpression({ entity, withLabels }));

      // Then
      expect(result.current.type).toEqual('EXPRESSION');
      expect(result.current.logicalOperator).toEqual('AND');
      expect(result.current.elements).toContainEqual({
        entity: 'DESTINATION',
        name: 'application.name',
        operator: 'EQUALS',
        type: 'TAG_FILTER',
        value: 'Snacktastic'
      });
      expect(result.current.elements).toContainEqual({
        entity: 'NOT_APPLICABLE',
        name: 'service.name',
        operator: 'EQUALS',
        type: 'TAG_FILTER',
        value: 'Shopping cart'
      });
      expect(result.current.elements).toContainEqual({
        entity: 'NOT_APPLICABLE',
        name: 'endpoint.name',
        operator: 'EQUALS',
        type: 'TAG_FILTER',
        value: 'Purchase snack'
      });
    });

    it('returns a TagFilterExpression for application entity without endpoint and service ID', () => {
      // Given
      const withLabels = true;

      const entity: ApplicationSloEntity = {
        type: 'application',
        boundaryScope: 'ALL',
        applicationId: 'snackTasticAppId',
        endpointId: 'purchaseSnackId',
        serviceId: 'shoppingCartId'
      };

      // When
      const { result } = renderHook(() => useBasicTagFilterExpression({ entity, withLabels }));

      // Then
      expect(result.current.type).toEqual('EXPRESSION');
      expect(result.current.logicalOperator).toEqual('AND');
      expect(result.current.elements).toContainEqual({
        entity: 'DESTINATION',
        name: 'application.name',
        operator: 'EQUALS',
        type: 'TAG_FILTER',
        value: 'Snacktastic'
      });
    });

    it('returns a TagFilterExpression for website entity', () => {
      // Given
      const withLabels = true;

      const entity: WebsiteSloEntity = {
        type: 'website',
        beaconType: 'httpRequest',
        websiteId: 'gigaGigglesWebsiteId'
      };

      // When
      const { result } = renderHook(() => useBasicTagFilterExpression({ entity, withLabels }));

      // Then
      expect(result.current.type).toEqual('EXPRESSION');
      expect(result.current.logicalOperator).toEqual('AND');
      expect(result.current.elements).toContainEqual({
        entity: 'NOT_APPLICABLE',
        name: 'beacon.website.name',
        operator: 'EQUALS',
        type: 'TAG_FILTER',
        value: 'GigaGiggles'
      });
    });
  });

  it('returns a TagFilterExpression conjunction of basic filter and the ones that are given by the entity', () => {
    // Given
    const withLabels = true;

    const entity: WebsiteSloEntity = {
      type: 'website',
      beaconType: 'httpRequest',
      websiteId: 'gigaGigglesWebsiteId',
      tagFilterExpression: tagFilter('beacon.http.method', 'EQUALS', 'GET')
    };

    // When
    const { result } = renderHook(() => useBasicTagFilterExpression({ entity, withLabels }));

    // Then
    expect(result.current.type).toEqual('EXPRESSION');
    expect(result.current.logicalOperator).toEqual('AND');
    expect(result.current.elements).toContainEqual({
      entity: 'NOT_APPLICABLE',
      name: 'beacon.website.name',
      operator: 'EQUALS',
      type: 'TAG_FILTER',
      value: 'GigaGiggles'
    });
    expect(result.current.elements).toContainEqual({
      entity: 'NOT_APPLICABLE',
      name: 'beacon.http.method',
      operator: 'EQUALS',
      type: 'TAG_FILTER',
      value: 'GET'
    });
  });
});
