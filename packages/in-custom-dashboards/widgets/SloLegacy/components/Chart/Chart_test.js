/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import { shallow } from 'enzyme';
import React from 'react';

import { Message } from '@instana/components';

import useShouldShowMissingDataIndicator from 'in-custom-dashboards/widgets/SloLegacy/hooks/useShouldShowMissingDataIndicator';
import { useStairwayRenderer } from 'in-service-levels/components/SloDashboard/components/chart/renderer/stairway';
import ChartMarkerLanes from 'in-custom-dashboards/widgets/SloLegacy/components/ChartMarkerLanes/ChartMarkerLanes';
import { getTagCatalog as getWebsiteTagCatalog } from 'in-websites/api/tagCatalog';
import Chart from 'in-custom-dashboards/widgets/SloLegacy/components/Chart/Chart';
import { getApplicationTagCatalog } from 'in-applications/api/catalog';
import { emptyArray, pendingResult } from 'in-services/fixedObjects';
import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
import { CALLS } from 'in-applications/analyze/metrics';
import { success } from 'in-services/util/result';

jest.mock('in-applications/api/catalog', () => ({
  getApplicationTagCatalog: jest.fn(() => () => ({ tags: [] }))
}));
jest.mock('in-websites/api/tagCatalog', () => ({
  getTagCatalog: jest.fn(() => () => ({ tags: [] }))
}));
jest.mock('in-services/featureFlags', () => ({
  sliCHClusterAccessEnabled: true
}));
jest.mock('in-service-levels/components/SloDashboard/components/chart/renderer/stairway');
jest.mock('in-custom-dashboards/widgets/SloLegacy/hooks/useShouldShowMissingDataIndicator');
jest.mock('in-custom-dashboards/widgets/SloLegacy/hooks/analytics/useLinkToUnboundedAnalytics');

describe('in-custom-dashboards/widgets/SloLegacy/Chart', () => {
  beforeEach(jest.clearAllMocks);

  const defaultProps = {
    result: success([]),
    timeConfig: { windowSize: 1, autoRefresh: false },
    granularity: 1,
    consumed: [],
    hourlyBudget: [],
    budget: 0
  };

  it('uses the application tag catalog for application time based sli configs', () => {
    // Given
    const sliConfig = {
      sliEntity: { sliType: 'application' }
    };

    // When
    shallow(<Chart {...defaultProps} sliConfig={sliConfig} />);

    // Then
    expect(getApplicationTagCatalog).toHaveBeenLastCalledWith({ dataSource: CALLS, useCase: 'FILTERING' });
  });

  it('uses the application tag catalog for application event based sli configs', () => {
    // Given
    const sliConfig = {
      sliEntity: { sliType: 'availability' }
    };

    // When
    shallow(<Chart {...defaultProps} sliConfig={sliConfig} />);

    // Then
    expect(getApplicationTagCatalog).toHaveBeenLastCalledWith({ dataSource: CALLS, useCase: 'FILTERING' });
  });

  it('uses the website tag catalog for website time based sli configs and selects the configs beacon type', () => {
    // Given
    const sliConfig = {
      sliEntity: { sliType: 'websiteTimeBased', beaconType: 'HONKS' }
    };

    // When
    shallow(<Chart {...defaultProps} sliConfig={sliConfig} />);

    // Then
    expect(getWebsiteTagCatalog).toHaveBeenLastCalledWith({ beaconType: 'HONKS', useCase: 'FILTERING' });
  });

  it('uses the website tag catalog for website event based sli configs and selects teh configs beacon type', () => {
    // Given
    const sliConfig = {
      sliEntity: { sliType: 'websiteEventBased', beaconType: 'HONKS' }
    };

    // When
    shallow(<Chart {...defaultProps} sliConfig={sliConfig} />);

    // Then
    expect(getWebsiteTagCatalog).toHaveBeenLastCalledWith({ beaconType: 'HONKS', useCase: 'FILTERING' });
  });

  it.each([[null], [emptyArray]])(
    'creates a static hourlyBudget from the given budget if hourlyBudget is %s',
    hourlyBudget => {
      // Given
      const sliConfig = {
        sliEntity: { sliType: 'availability' }
      };
      const consumed = [
        [1, 2],
        [2, 4],
        [3, 6]
      ];
      const budget = 10;

      // When
      const wrapper = shallow(
        <Chart
          {...defaultProps}
          hourlyBudget={hourlyBudget}
          consumed={consumed}
          budget={budget}
          sliConfig={sliConfig}
        />
      );

      // Then
      expect(wrapper.find(ResultAwareChart).prop('config')).toEqual(
        expect.objectContaining({
          y1: expect.objectContaining({
            metrics: [
              consumed,
              [
                [1, 10],
                [2, 10],
                [3, 10]
              ]
            ]
          })
        })
      );
    }
  );

  it('does not set any context menu properties if sliConfig is undefined', () => {
    // Given
    const sliConfig = undefined;

    // When
    const wrapper = shallow(<Chart {...defaultProps} sliConfig={sliConfig} />);

    // Then
    expect(wrapper.find(ResultAwareChart).prop('config')).toEqual(
      expect.not.objectContaining({
        primaryContextMenuAction: expect.anything(),
        excludedContextMenuActions: expect.anything(),
        additionalContextMenuButtons: expect.anything()
      })
    );
  });

  it('disables zoomIn if disableZooming is true', () => {
    // Given
    const sliConfig = {
      sliEntity: { sliType: 'availability' }
    };
    const disableZooming = true;

    // When
    const wrapper = shallow(<Chart {...defaultProps} disableZooming={disableZooming} sliConfig={sliConfig} />);

    // Then
    expect(wrapper.find(ResultAwareChart).prop('config')).toEqual(
      expect.objectContaining({
        excludedContextMenuActions: ['zoomIn']
      })
    );
  });

  it('does not render a missing data info message when showMissingDataIndicators is false', () => {
    // Given
    const isPreview = true;
    const sliConfig = {
      sliEntity: { sliType: 'availability' }
    };
    const timeConfig = { to: 10, windowSize: 9, autoRefresh: false };
    useShouldShowMissingDataIndicator.mockReturnValueOnce(false);

    // When
    const wrapper = shallow(
      <Chart {...defaultProps} nonInteractive={isPreview} sliConfig={sliConfig} timeConfig={timeConfig} />
    );

    // Then
    expect(wrapper.containsMatchingElement(<Message />)).toBeFalsy();
  });

  it('renders a missing data info message when showMissingDataIndicators is true', () => {
    // Given
    const isPreview = true;
    const sliConfig = {
      sliEntity: { sliType: 'availability' }
    };
    const timeConfig = { to: 10, windowSize: 9, autoRefresh: false };
    useShouldShowMissingDataIndicator.mockReturnValueOnce(true);

    // When
    const wrapper = shallow(
      <Chart {...defaultProps} nonInteractive={isPreview} sliConfig={sliConfig} timeConfig={timeConfig} />
    );

    // Then
    expect(wrapper.containsMatchingElement(<Message />)).toBeTruthy();
  });

  it('renders the sli ChartMarkerLanes when the sli was created within the configured timeWindow', () => {
    // Given
    const sliConfig = {
      sliEntity: { sliType: 'availability' },
      lastUpdated: 3
    };
    const timeConfig = { to: 10, windowSize: 9, autoRefresh: false };
    useShouldShowMissingDataIndicator.mockReturnValueOnce(true);

    // When
    const wrapper = shallow(<Chart {...defaultProps} sliConfig={sliConfig} timeConfig={timeConfig} />);
    const RenderChartMarkerLanes = wrapper.find(ResultAwareChart).prop('config').renderPostChartContent;
    const postChartContentWrapper = shallow(
      <RenderChartMarkerLanes timeConfig={timeConfig} chartContentPosition={'post'} />
    );

    // Then
    expect(
      postChartContentWrapper.containsMatchingElement(
        <ChartMarkerLanes tooltipContent={null} timeConfig={timeConfig} chartContentPosition={'post'} />
      )
    ).toBeTruthy();
  });

  it('does not render the sli ChartMarkerLanes when the sli was created within the configured timeWindow, but the result is loading', () => {
    // Given
    const result = pendingResult;
    const sliConfig = {
      sliEntity: { sliType: 'availability' }
    };
    const timeConfig = { to: 10, windowSize: 9, autoRefresh: false };

    // When
    const wrapper = shallow(<Chart {...defaultProps} result={result} sliConfig={sliConfig} timeConfig={timeConfig} />);
    const RenderChartMarkerLanes = wrapper.find(ResultAwareChart).prop('config').renderPostChartContent;
    const postChartContentWrapper = shallow(
      <RenderChartMarkerLanes timeConfig={timeConfig} chartContentPosition={'post'} />
    );

    // Then
    expect(
      postChartContentWrapper.containsMatchingElement(
        <ChartMarkerLanes tooltipContent={null} timeConfig={timeConfig} chartContentPosition={'post'} />
      )
    ).toBeFalsy();
  });

  it('does not render the sli ChartMarkerLanes when the sli was created within the configured timeWindow, but isPreview is true', () => {
    // Given
    const isPreview = true;
    const sliConfig = {
      sliEntity: { sliType: 'availability' }
    };
    const timeConfig = { to: 10, windowSize: 9, autoRefresh: false };

    // When
    const wrapper = shallow(
      <Chart {...defaultProps} nonInteractive={isPreview} sliConfig={sliConfig} timeConfig={timeConfig} />
    );
    const RenderChartMarkerLanes = wrapper.find(ResultAwareChart).prop('config').renderPostChartContent;
    const postChartContentWrapper = shallow(
      <RenderChartMarkerLanes timeConfig={timeConfig} chartContentPosition={'post'} />
    );

    // Then
    expect(
      postChartContentWrapper.containsMatchingElement(
        <ChartMarkerLanes tooltipContent={null} timeConfig={timeConfig} chartContentPosition={'post'} />
      )
    ).toBeFalsy();
  });

  it('uses lastUpdated value from sliConfig when calling useShouldShowMissingDataIndicator, if sliCHClusterAccessEnabled is set to true', () => {
    // Given
    const isPreview = true;
    const lastUpdated = 3;
    const sliConfig = {
      sliEntity: { sliType: 'availability' },
      lastUpdated,
      initialEvaluationTimestamp: 4
    };
    const timeConfig = { to: 10, windowSize: 9, autoRefresh: false };
    useShouldShowMissingDataIndicator.mockReturnValueOnce(true);

    // When
    shallow(<Chart {...defaultProps} nonInteractive={isPreview} sliConfig={sliConfig} timeConfig={timeConfig} />);

    // Then
    expect(useShouldShowMissingDataIndicator).toHaveBeenLastCalledWith(
      expect.objectContaining({ initialEvaluationTimestamp: lastUpdated })
    );
  });

  it('uses initialEvaluationTimestamp value from sliConfig when calling useShouldShowMissingDataIndicator, if sliCHClusterAccessEnabled is set to false', async () => {
    jest.resetModules();
    jest.doMock('in-services/featureFlags', () => ({
      sliCHClusterAccessEnabled: false
    }));
    jest.doMock('react', () => {
      const react = jest.requireActual('react');

      return {
        ...react,
        useMemo: jest.fn(fn => fn())
      };
    });
    jest.doMock('in-applications/hooks/useTagCatalog');
    jest.doMock('in-custom-dashboards/widgets/SloLegacy/hooks/useShouldShowMissingDataIndicator');

    const { default: Chart } = await import('in-custom-dashboards/widgets/SloLegacy/components/Chart/Chart');
    const { default: useShouldShowMissingDataIndicator } = await import(
      'in-custom-dashboards/widgets/SloLegacy/hooks/useShouldShowMissingDataIndicator'
    );

    const isPreview = true;
    const initialEvaluationTimestamp = 4;
    const sliConfig = {
      sliEntity: { sliType: 'availability' },
      lastUpdated: 3,
      initialEvaluationTimestamp
    };
    const timeConfig = { to: 10, windowSize: 9, autoRefresh: false };

    useShouldShowMissingDataIndicator.mockReturnValueOnce(true);

    // When
    shallow(<Chart {...defaultProps} nonInteractive={isPreview} sliConfig={sliConfig} timeConfig={timeConfig} />);

    // Then
    expect(useShouldShowMissingDataIndicator).toHaveBeenLastCalledWith(
      expect.objectContaining({ initialEvaluationTimestamp })
    );
  });

  it('uses lastUpdated value from sliConfig when calling useStairwayRenderer, if sliCHClusterAccessEnabled is set to true', () => {
    // Given
    const isPreview = true;
    const lastUpdated = 3;
    const sliConfig = {
      sliEntity: { sliType: 'availability' },
      lastUpdated,
      initialEvaluationTimestamp: 4
    };
    const timeConfig = { to: 10, windowSize: 9, autoRefresh: false };
    useStairwayRenderer.mockReturnValueOnce(true);

    // When
    shallow(<Chart {...defaultProps} nonInteractive={isPreview} sliConfig={sliConfig} timeConfig={timeConfig} />);

    // Then
    expect(useStairwayRenderer).toHaveBeenLastCalledWith(
      expect.objectContaining({ firstCollectedMetricTimestamp: lastUpdated })
    );
  });

  it('uses initialEvaluationTimestamp value from sliConfig when calling useStairwayRenderer, if sliCHClusterAccessEnabled is set to false', async () => {
    jest.resetModules();
    jest.doMock('in-services/featureFlags', () => ({
      sliCHClusterAccessEnabled: false
    }));

    const { default: Chart } = await import('in-custom-dashboards/widgets/SloLegacy/components/Chart/Chart');
    const { useStairwayRenderer } = await import(
      'in-service-levels/components/SloDashboard/components/chart/renderer/stairway'
    );

    const isPreview = true;
    const initialEvaluationTimestamp = 4;
    const sliConfig = {
      sliEntity: { sliType: 'availability' },
      lastUpdated: 3,
      initialEvaluationTimestamp
    };
    const timeConfig = { to: 10, windowSize: 9, autoRefresh: false };

    useStairwayRenderer.mockReturnValueOnce(true);

    // When
    shallow(<Chart {...defaultProps} nonInteractive={isPreview} sliConfig={sliConfig} timeConfig={timeConfig} />);

    // Then
    expect(useStairwayRenderer).toHaveBeenLastCalledWith(
      expect.objectContaining({ firstCollectedMetricTimestamp: initialEvaluationTimestamp })
    );
  });
});
