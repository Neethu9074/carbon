/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { renderHook } from '@testing-library/react-hooks';

import { ApplicationSloEntity, EventBasedSli, TimeBasedSli, TimeConfig, WebsiteSloEntity } from '@instana/types';

import useBasicTagFilterExpressionOriginal from 'in-service-levels/navigation/hooks/useBasicFilterExpression';
import useHrefToUnboundedAnalytics from 'in-service-levels/navigation/hooks/useHrefToUnboundedAnalytics';
import emptyTagFilterExpression from 'in-components/QueryBuilder/tagFilter/emptyTagFilterExpression';
import { useNavigation as useNavigationOriginal } from 'in-stores/navigation/hooks/useNavigation';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { days } from 'in-services/time/time';

jest.mock('in-stores/navigation/hooks/useNavigation');
const useNavigation = useNavigationOriginal as jest.MockedFunction<typeof useNavigationOriginal>;
const { useNavigation: useNavigationActual } = jest.requireActual('in-stores/navigation/hooks/useNavigation');

jest.mock('in-service-levels/navigation/hooks/useBasicFilterExpression');
const useBasicTagFilterExpression = useBasicTagFilterExpressionOriginal as jest.MockedFunction<
  typeof useBasicTagFilterExpressionOriginal
>;

describe('in-service-levels/navigation/hooks/useHrefToUnboundedAnalytics', () => {
  const createHref = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
    useNavigation.mockImplementationOnce(() => {
      const navigation = useNavigationActual();
      return { ...navigation, createHref };
    });
    useBasicTagFilterExpression.mockReturnValueOnce(emptyTagFilterExpression);
  });

  const timeConfig: TimeConfig = {
    to: Date.now(),
    windowSize: days.toMillis(1),
    autoRefresh: false
  };

  describe('Given SLO entity is of type "application"', () => {
    it('creates location object with matrix-parameter to group by endpoint-name, when entity object contains an enpoint-id', () => {
      // Given
      const entity: ApplicationSloEntity = {
        applicationId: 'someAppId',
        boundaryScope: 'ALL',
        type: 'application',
        endpointId: 'someEndpointId',
        serviceId: 'someServiceId',
        tagFilterExpression: tagFilter('call.type', 'EQUALS', 'HTTP')
      };

      const indicator: EventBasedSli = {
        blueprint: 'latency',
        threshold: 0.8,
        type: 'eventBased'
      };

      // When
      renderHook(() => useHrefToUnboundedAnalytics({ entity, indicator, timeConfig }));

      expect(createHref).toBeCalledWith(
        expect.objectContaining({
          matrix: {
            '/analyze': expect.objectContaining({
              groupBy: '(groupbyTag~endpoint.name~groupbyTagEntity~DESTINATION)~'
            })
          },
          pathname: '/analyze'
        })
      );
    });

    it('creates location object with matrix-parameter to group by service-name, when enpoint-id is missing in entity object', () => {
      // Given
      const entity: ApplicationSloEntity = {
        applicationId: 'someAppId',
        boundaryScope: 'ALL',
        type: 'application',
        serviceId: 'someServiceId',
        tagFilterExpression: tagFilter('call.type', 'EQUALS', 'HTTP')
      };

      const indicator: EventBasedSli = {
        blueprint: 'latency',
        threshold: 0.8,
        type: 'eventBased'
      };

      // When
      renderHook(() => useHrefToUnboundedAnalytics({ entity, indicator, timeConfig }));

      expect(createHref).toBeCalledWith(
        expect.objectContaining({
          matrix: {
            '/analyze': expect.objectContaining({
              groupBy: '(groupbyTag~service.name~groupbyTagEntity~DESTINATION)~'
            })
          },
          pathname: '/analyze'
        })
      );
    });

    it('creates location object for a SLI with configured latency blueprint that contains matching matrix-parameter for charted metrics', () => {
      // Given
      const entity: ApplicationSloEntity = {
        applicationId: 'someAppId',
        boundaryScope: 'ALL',
        type: 'application',
        serviceId: 'someServiceId',
        tagFilterExpression: tagFilter('call.type', 'EQUALS', 'HTTP')
      };

      const indicator: EventBasedSli = {
        blueprint: 'latency',
        threshold: 0.8,
        type: 'eventBased'
      };

      // When
      renderHook(() => useHrefToUnboundedAnalytics({ entity, indicator, timeConfig }));

      expect(createHref).toBeCalledWith(
        expect.objectContaining({
          matrix: {
            '/analyze': expect.objectContaining({
              chartedMetrics: '!(metricId~latency~aggregationId~DISTRIBUTION)~'
            })
          },
          pathname: '/analyze'
        })
      );
    });

    it('creates location object for a SLI with configured availability blueprint that contains matching matrix-parameter for charted metrics', () => {
      // Given
      const entity: ApplicationSloEntity = {
        applicationId: 'someAppId',
        boundaryScope: 'ALL',
        type: 'application',
        serviceId: 'someServiceId',
        tagFilterExpression: tagFilter('call.type', 'EQUALS', 'HTTP')
      };

      const indicator: EventBasedSli = {
        blueprint: 'availability',
        threshold: 0.8,
        type: 'eventBased'
      };

      // When
      renderHook(() => useHrefToUnboundedAnalytics({ entity, indicator, timeConfig }));

      expect(createHref).toBeCalledWith(
        expect.objectContaining({
          matrix: {
            '/analyze': expect.objectContaining({
              chartedMetrics: '!(metricId~calls~aggregationId~SUM)~'
            })
          },
          pathname: '/analyze'
        })
      );
    });
  });

  describe('Given SLO entity is of type "website"', () => {
    it('creates location object with correct beacon-type', () => {
      // Given
      const entity: WebsiteSloEntity = {
        type: 'website',
        beaconType: 'pageLoad',
        websiteId: 'someWebsiteId',
        tagFilterExpression: tagFilter('call.type', 'EQUALS', 'HTTP')
      };

      const indicator: EventBasedSli = {
        blueprint: 'latency',
        threshold: 0.8,
        type: 'eventBased'
      };

      // When
      renderHook(() => useHrefToUnboundedAnalytics({ entity, indicator, timeConfig }));

      expect(createHref).toBeCalledWith(
        expect.objectContaining({
          matrix: {
            '/analyzeBeacons': expect.objectContaining({
              beaconType: 'pageLoad'
            })
          },
          pathname: '/websiteMonitoring/analyzeBeacons'
        })
      );
    });

    it('creates location object for an SLI with configured latency blueprint that contains matching matrix-parameter for fields and charted metrics', () => {
      // Given
      const entity: WebsiteSloEntity = {
        type: 'website',
        beaconType: 'pageLoad',
        websiteId: 'someWebsiteId',
        tagFilterExpression: tagFilter('call.type', 'EQUALS', 'HTTP')
      };

      const indicator: EventBasedSli = {
        blueprint: 'latency',
        threshold: 0.8,
        type: 'eventBased'
      };

      // When
      renderHook(() => useHrefToUnboundedAnalytics({ entity, indicator, timeConfig }));

      expect(createHref).toBeCalledWith(
        expect.objectContaining({
          matrix: {
            '/analyzeBeacons': expect.objectContaining({
              chartedMetrics: '!(metricId~beaconDuration~aggregationId~MEAN)~',
              fields: '!(metricId~beaconDuration~aggregationId~MEAN~type~metric)~'
            })
          },
          pathname: '/websiteMonitoring/analyzeBeacons'
        })
      );
    });

    it('creates location object for an SLI with configured availability blueprint that contains matching matrix-parameter for fields and charted metrics', () => {
      // Given
      const entity: WebsiteSloEntity = {
        type: 'website',
        beaconType: 'pageLoad',
        websiteId: 'someWebsiteId',
        tagFilterExpression: tagFilter('call.type', 'EQUALS', 'HTTP')
      };

      const indicator: EventBasedSli = {
        blueprint: 'availability',
        threshold: 0.8,
        type: 'eventBased'
      };

      // When
      renderHook(() => useHrefToUnboundedAnalytics({ entity, indicator, timeConfig }));

      expect(createHref).toBeCalledWith(
        expect.objectContaining({
          matrix: {
            '/analyzeBeacons': expect.objectContaining({
              chartedMetrics: '!(metricId~beaconErrorRate~aggregationId~MEAN)~',
              fields: '!(metricId~beaconErrorRate~aggregationId~MEAN~type~metric)~'
            })
          },
          pathname: '/websiteMonitoring/analyzeBeacons'
        })
      );
    });

    it('creates location object for an time-based SLI that contains matching matrix-parameter for fields and charted metrics', () => {
      // Given
      const entity: WebsiteSloEntity = {
        type: 'website',
        beaconType: 'pageLoad',
        websiteId: 'someWebsiteId',
        tagFilterExpression: tagFilter('call.type', 'EQUALS', 'HTTP')
      };

      const indicator: TimeBasedSli = {
        blueprint: 'latency',
        threshold: 0.8,
        type: 'timeBased',
        aggregation: 'P90'
      };

      // When
      renderHook(() => useHrefToUnboundedAnalytics({ entity, indicator, timeConfig }));

      expect(createHref).toBeCalledWith(
        expect.objectContaining({
          matrix: {
            '/analyzeBeacons': expect.objectContaining({
              chartedMetrics: '!(metricId~beaconDuration~aggregationId~P90)~',
              fields: '!(metricId~beaconDuration~aggregationId~P90~type~metric)~'
            })
          },
          pathname: '/websiteMonitoring/analyzeBeacons'
        })
      );
    });
  });
});
