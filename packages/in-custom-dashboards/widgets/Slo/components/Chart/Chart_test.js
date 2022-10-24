/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import { shallow } from 'enzyme';
import React from 'react';

import { Message } from '@instana/components';

import ChartMarkerLanes from 'in-custom-dashboards/widgets/Slo/components/ChartMarkerLanes/ChartMarkerLanes';
import { getTagCatalog as getWebsiteTagCatalog } from 'in-websites/api/tagCatalog';
import Chart from 'in-custom-dashboards/widgets/Slo/components/Chart/Chart';
import { getApplicationTagCatalog } from 'in-applications/api/catalog';
import { emptyArray, pendingResult } from 'in-services/fixedObjects';
import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
import { CALLS } from 'in-applications/analyze/metrics';
import { success } from 'in-services/util/result';
import { t } from 'in-i18n';

jest.mock('in-applications/api/catalog', () => ({
  getApplicationTagCatalog: jest.fn(() => () => ({ tags: [] }))
}));
jest.mock('in-websites/api/tagCatalog', () => ({
  getTagCatalog: jest.fn(() => () => ({ tags: [] }))
}));
jest.mock('in-services/featureFlags', () => ({
  sliCHClusterAccessEnabled: true
}));

describe('in-custom-dashboards/widgets/Slo/Chart', () => {
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

  it('renders a missing data info message when the sli was created within the configured timeWindow', () => {
    // Given
    const sliConfig = {
      sliEntity: { sliType: 'availability' },
      initialEvaluationTimestamp: 3
    };
    const timeConfig = { to: 10, windowSize: 9, autoRefresh: false };

    // When
    const wrapper = shallow(<Chart {...defaultProps} sliConfig={sliConfig} timeConfig={timeConfig} />);

    // Then
    expect(wrapper.find(Message).prop('title')).toEqual(
      t('in-custom-dashboards:widgets.slo.chart.missingDataInfo', {
        configType: t('in-custom-dashboards:widgets.slo.chart.configType')
      })
    );
  });

  it('does not render a missing data info message when the sli was created within the configured timeWindow, but the result is loading', () => {
    // Given
    const result = pendingResult;
    const sliConfig = {
      sliEntity: { sliType: 'availability' },
      initialEvaluationTimestamp: 3
    };
    const timeConfig = { to: 10, windowSize: 9, autoRefresh: false };

    // When
    const wrapper = shallow(<Chart {...defaultProps} result={result} sliConfig={sliConfig} timeConfig={timeConfig} />);

    // Then
    expect(wrapper.containsMatchingElement(<Message />)).toBeFalsy();
  });

  it('does not render a missing data info message when the sli was created within the configured timeWindow, but isPreview is true', () => {
    // Given
    const isPreview = true;
    const sliConfig = {
      sliEntity: { sliType: 'availability' },
      initialEvaluationTimestamp: 3
    };
    const timeConfig = { to: 10, windowSize: 9, autoRefresh: false };

    // When
    const wrapper = shallow(
      <Chart {...defaultProps} nonInteractive={isPreview} sliConfig={sliConfig} timeConfig={timeConfig} />
    );

    // Then
    expect(wrapper.containsMatchingElement(<Message />)).toBeFalsy();
  });

  it('does renders a missing data info message when the sli when the sli was created within now and the timeConfigs windowSize when live mode is enabled', () => {
    // Given
    jest.useFakeTimers();
    const sliConfig = {
      sliEntity: { sliType: 'availability' },
      initialEvaluationTimestamp: 7
    };
    const timeConfig = { windowSize: 5, autoRefresh: true };
    jest.setSystemTime(10);

    // When
    const wrapper = shallow(<Chart {...defaultProps} sliConfig={sliConfig} timeConfig={timeConfig} />);

    // Then
    expect(wrapper.find(Message).prop('title')).toEqual(
      t('in-custom-dashboards:widgets.slo.chart.missingDataInfo', {
        configType: t('in-custom-dashboards:widgets.slo.chart.configType')
      })
    );
  });

  it('does not render a missing data info message when the sli was created outside the configured timeWindow and live mode is enabled', () => {
    jest.useFakeTimers();
    // Given
    const sliConfig = {
      sliEntity: { sliType: 'availability' },
      initialEvaluationTimestamp: 1
    };
    const timeConfig = { windowSize: 5, autoRefresh: true };
    jest.setSystemTime(10);

    // When
    const wrapper = shallow(<Chart {...defaultProps} sliConfig={sliConfig} timeConfig={timeConfig} />);

    // Then
    expect(wrapper.containsMatchingElement(<Message />)).toBeFalsy();
  });

  it('renders the sli ChartMarkerLanes when the sli was created within the configured timeWindow', () => {
    // Given
    const sliConfig = {
      sliEntity: { sliType: 'availability' },
      initialEvaluationTimestamp: 3
    };
    const timeConfig = { to: 10, windowSize: 9, autoRefresh: false };

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
      sliEntity: { sliType: 'availability' },
      initialEvaluationTimestamp: 3
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
      sliEntity: { sliType: 'availability' },
      initialEvaluationTimestamp: 3
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
});
