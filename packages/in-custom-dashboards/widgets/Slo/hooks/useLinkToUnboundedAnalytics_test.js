/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import getJumpDirectlyToApplicationLikeUA2Href$ from 'in-custom-dashboards/widgets/Slo/getJumpDirectlyToApplicationLikeUA2Href';
import { useLinkToUnboundedAnalytics } from 'in-custom-dashboards/widgets/Slo/hooks/useLinkToUnboundedAnalytics';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { createChartedMetric } from 'in-analyze/navigation/paths';

jest.mock('in-custom-dashboards/widgets/Slo/getJumpDirectlyToApplicationLikeUA2Href', () => ({
  __esModule: true,
  default: jest.fn()
}));

describe('in-custom-dashboards/widgets/Slo/hooks/useLinkToUnboundedAnalytics', () => {
  afterEach(jest.clearAllMocks);

  const tagCatalog = { tags: [] };
  const timeConfig = {
    windowSize: 500,
    autoRefresh: false
  };

  describe('for application event based sli configurations', () => {
    const sliConfig = {
      sliEntity: {
        sliType: 'availability',
        badEventFilterExpression: tagFilter('call.erroneous', 'EQUALS', true),
        boundaryScope: 'INBOUND'
      }
    };

    describe('calls getJumpDirectlyToApplicationLikeUA2Href$', () => {
      beforeEach(() => useLinkToUnboundedAnalytics(sliConfig, tagCatalog)(timeConfig));

      it('with the sliEntities badEventFilterExpression', () => {
        expect(getJumpDirectlyToApplicationLikeUA2Href$).toHaveBeenLastCalledWith(
          expect.anything(),
          tagFilter('call.erroneous', 'EQUALS', true),
          expect.anything(),
          expect.anything(),
          expect.anything()
        );
      });

      it('with the sliEntities boundaryScope', () => {
        expect(getJumpDirectlyToApplicationLikeUA2Href$).toHaveBeenLastCalledWith(
          expect.anything(),
          expect.anything(),
          expect.anything(),
          'INBOUND',
          expect.anything()
        );
      });

      it('with the provided timeConfig', () => {
        expect(getJumpDirectlyToApplicationLikeUA2Href$).toHaveBeenLastCalledWith(
          expect.anything(),
          expect.anything(),
          expect.anything(),
          expect.anything(),
          expect.objectContaining({
            timeConfig
          })
        );
      });

      it('if serviceId and endpointId are set grouped by endpoint', () => {
        // Given
        const config = {
          ...sliConfig,
          sliEntity: {
            ...sliConfig.sliEntity,
            serviceId: 'someString',
            endpointId: 'someOtherString'
          }
        };

        // When
        useLinkToUnboundedAnalytics(config, tagCatalog)(timeConfig);

        // Then
        expect(getJumpDirectlyToApplicationLikeUA2Href$).toHaveBeenLastCalledWith(
          expect.anything(),
          expect.anything(),
          expect.anything(),
          expect.anything(),
          expect.objectContaining({
            groupBy: {
              groupbyTagEntity: 'DESTINATION',
              groupbyTag: 'endpoint.name'
            }
          })
        );
      });

      it('if only serviceId is set grouped by endpoint', () => {
        // Given
        const config = {
          ...sliConfig,
          sliEntity: {
            ...sliConfig.sliEntity,
            serviceId: 'someString'
          }
        };

        // When
        useLinkToUnboundedAnalytics(config, tagCatalog)(timeConfig);

        // Then
        expect(getJumpDirectlyToApplicationLikeUA2Href$).toHaveBeenLastCalledWith(
          expect.anything(),
          expect.anything(),
          expect.anything(),
          expect.anything(),
          expect.objectContaining({
            groupBy: {
              groupbyTagEntity: 'DESTINATION',
              groupbyTag: 'endpoint.name'
            }
          })
        );
      });

      it('if neither serviceId nor endpointId is set grouped by service', () => {
        expect(getJumpDirectlyToApplicationLikeUA2Href$).toHaveBeenLastCalledWith(
          expect.anything(),
          expect.anything(),
          expect.anything(),
          expect.anything(),
          expect.objectContaining({
            groupBy: {
              groupbyTagEntity: 'DESTINATION',
              groupbyTag: 'service.name'
            }
          })
        );
      });

      it('includes internal calls if includeInternal is set on the sliEntity', () => {
        // Given
        const config = {
          ...sliConfig,
          sliEntity: {
            ...sliConfig.sliEntity,
            includeInternal: true
          }
        };

        // When
        useLinkToUnboundedAnalytics(config, tagCatalog)(timeConfig);

        // Then
        expect(getJumpDirectlyToApplicationLikeUA2Href$).toHaveBeenLastCalledWith(
          expect.anything(),
          expect.anything(),
          expect.anything(),
          expect.anything(),
          expect.objectContaining({
            hiddenCalls: expect.objectContaining({
              includeInternal: true
            })
          })
        );
      });

      it('includes synthetic calls if includeSynthetic is set on the sliEntity', () => {
        // Given
        const config = {
          ...sliConfig,
          sliEntity: {
            ...sliConfig.sliEntity,
            includeSynthetic: true
          }
        };

        // When
        useLinkToUnboundedAnalytics(config, tagCatalog)(timeConfig);

        // Then
        expect(getJumpDirectlyToApplicationLikeUA2Href$).toHaveBeenLastCalledWith(
          expect.anything(),
          expect.anything(),
          expect.anything(),
          expect.anything(),
          expect.objectContaining({
            hiddenCalls: expect.objectContaining({
              includeSynthetic: true
            })
          })
        );
      });

      it('defaults to not include internal and synthetic calls', () => {
        expect(getJumpDirectlyToApplicationLikeUA2Href$).toHaveBeenLastCalledWith(
          expect.anything(),
          expect.anything(),
          expect.anything(),
          expect.anything(),
          expect.objectContaining({
            hiddenCalls: {}
          })
        );
      });

      it('charts calls metrics', () => {
        expect(getJumpDirectlyToApplicationLikeUA2Href$).toHaveBeenLastCalledWith(
          expect.anything(),
          expect.anything(),
          expect.anything(),
          expect.anything(),
          expect.objectContaining({
            chartedMetrics: [createChartedMetric('calls', 'SUM')]
          })
        );
      });
    });
  });

  describe('for application time based sli configurations', () => {
    const sliConfig = {
      sliEntity: {
        sliType: 'application',
        boundaryScope: 'INBOUND'
      }
    };

    describe('calls getJumpDirectlyToApplicationLikeUA2Href$', () => {
      beforeEach(() => useLinkToUnboundedAnalytics(sliConfig, tagCatalog)(timeConfig));

      it('filtered by call.latency > the threshold value for latency metrics', () => {
        // Given
        const config = {
          ...sliConfig,
          metricConfiguration: {
            metricName: 'latency',
            threshold: 123
          }
        };

        // When
        useLinkToUnboundedAnalytics(config, tagCatalog)(timeConfig);

        // Then
        expect(getJumpDirectlyToApplicationLikeUA2Href$).toHaveBeenLastCalledWith(
          expect.anything(),
          expect.anything(),
          expect.arrayContaining([tagFilter('call.latency', 'GREATER_THAN', 123)]),
          expect.anything(),
          expect.anything()
        );
      });

      it('filtered by call.erroneous for errors metrics', () => {
        // Given
        const config = {
          ...sliConfig,
          metricConfiguration: {
            metricName: 'errors'
          }
        };

        // When
        useLinkToUnboundedAnalytics(config, tagCatalog)(timeConfig);

        // Then
        expect(getJumpDirectlyToApplicationLikeUA2Href$).toHaveBeenLastCalledWith(
          expect.anything(),
          expect.anything(),
          expect.arrayContaining([tagFilter('call.erroneous', 'EQUALS', true)]),
          expect.anything(),
          expect.anything()
        );
      });

      it('filtered by call.erroneous for erroneousCalls metrics', () => {
        // Given
        const config = {
          ...sliConfig,
          metricConfiguration: {
            metricName: 'erroneousCalls',
            threshold: 123
          }
        };

        // When
        useLinkToUnboundedAnalytics(config, tagCatalog)(timeConfig);

        // Then
        expect(getJumpDirectlyToApplicationLikeUA2Href$).toHaveBeenLastCalledWith(
          expect.anything(),
          expect.anything(),
          expect.arrayContaining([tagFilter('call.erroneous', 'EQUALS', true)]),
          expect.anything(),
          expect.anything()
        );
      });

      it('with the sliEntities boundaryScope', () => {
        expect(getJumpDirectlyToApplicationLikeUA2Href$).toHaveBeenLastCalledWith(
          expect.anything(),
          expect.anything(),
          expect.anything(),
          'INBOUND',
          expect.anything()
        );
      });

      it('with the provided timeConfig', () => {
        expect(getJumpDirectlyToApplicationLikeUA2Href$).toHaveBeenLastCalledWith(
          expect.anything(),
          expect.anything(),
          expect.anything(),
          expect.anything(),
          expect.objectContaining({
            timeConfig
          })
        );
      });

      it('if serviceId and endpointId are set grouped by endpoint', () => {
        // Given
        const config = {
          ...sliConfig,
          sliEntity: {
            ...sliConfig.sliEntity,
            serviceId: 'someString',
            endpointId: 'someOtherString'
          }
        };

        // When
        useLinkToUnboundedAnalytics(config, tagCatalog)(timeConfig);

        // Then
        expect(getJumpDirectlyToApplicationLikeUA2Href$).toHaveBeenLastCalledWith(
          expect.anything(),
          expect.anything(),
          expect.anything(),
          expect.anything(),
          expect.objectContaining({
            groupBy: {
              groupbyTagEntity: 'DESTINATION',
              groupbyTag: 'endpoint.name'
            }
          })
        );
      });

      it('if only serviceId is set grouped by endpoint', () => {
        // Given
        const config = {
          ...sliConfig,
          sliEntity: {
            ...sliConfig.sliEntity,
            serviceId: 'someString'
          }
        };

        // When
        useLinkToUnboundedAnalytics(config, tagCatalog)(timeConfig);

        // Then
        expect(getJumpDirectlyToApplicationLikeUA2Href$).toHaveBeenLastCalledWith(
          expect.anything(),
          expect.anything(),
          expect.anything(),
          expect.anything(),
          expect.objectContaining({
            groupBy: {
              groupbyTagEntity: 'DESTINATION',
              groupbyTag: 'endpoint.name'
            }
          })
        );
      });

      it('if neither serviceId nor endpointId is set grouped by service', () => {
        expect(getJumpDirectlyToApplicationLikeUA2Href$).toHaveBeenLastCalledWith(
          expect.anything(),
          expect.anything(),
          expect.anything(),
          expect.anything(),
          expect.objectContaining({
            groupBy: {
              groupbyTagEntity: 'DESTINATION',
              groupbyTag: 'service.name'
            }
          })
        );
      });

      it('charts calls the metric if metricName is not latency', () => {
        // Given
        const config = {
          ...sliConfig,
          metricConfiguration: {
            metricName: 'errors'
          }
        };

        // When
        useLinkToUnboundedAnalytics(config, tagCatalog)(timeConfig);

        //Then
        expect(getJumpDirectlyToApplicationLikeUA2Href$).toHaveBeenLastCalledWith(
          expect.anything(),
          expect.anything(),
          expect.anything(),
          expect.anything(),
          expect.objectContaining({
            chartedMetrics: [createChartedMetric('calls', 'SUM')]
          })
        );
      });
      it('charts latency the metric if metricName is latency', () => {
        // Given
        const config = {
          ...sliConfig,
          metricConfiguration: {
            metricName: 'latency'
          }
        };

        // When
        useLinkToUnboundedAnalytics(config, tagCatalog)(timeConfig);

        //Then
        expect(getJumpDirectlyToApplicationLikeUA2Href$).toHaveBeenLastCalledWith(
          expect.anything(),
          expect.anything(),
          expect.anything(),
          expect.anything(),
          expect.objectContaining({
            chartedMetrics: [createChartedMetric('latency', 'DISTRIBUTION')]
          })
        );
      });
    });
  });

  it('returns an empty string if sliConfig is undefined', done => {
    // Given
    const config = undefined;

    // When
    const actual = useLinkToUnboundedAnalytics(config, tagCatalog)(timeConfig);

    // Then
    actual.subscribe(data => {
      expect(data).toEqual('');
      done();
    }, done);
  });

  it('returns an empty string if tagCatalog is undefined', done => {
    // Given
    const catalog = undefined;
    const sliConfig = {
      sliEntity: {
        sliType: 'application',
        boundaryScope: 'INBOUND'
      }
    };

    // When
    const actual = useLinkToUnboundedAnalytics(sliConfig, catalog)(timeConfig);

    // Then
    actual.subscribe(data => {
      expect(data).toEqual('');
      done();
    }, done);
  });
});
