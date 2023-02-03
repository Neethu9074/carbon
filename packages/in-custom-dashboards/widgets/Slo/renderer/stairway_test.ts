/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import stairway, { useStairwayRenderer } from 'in-custom-dashboards/widgets/Slo/renderer/stairway';
import { DataSeries, RenderConfig, RenderProps } from 'in-components/Chart/renderer/types';
import { drawPoint } from 'in-components/Chart/renderer/point';
import createScale from 'in-services/scale';

jest.mock('in-components/Chart/renderer/point', () => ({
  drawPoint: jest.fn()
}));

describe('in-custom-dashboards/widgets/Slo/renderer/stairway', () => {
  const config = ({
    xScaleBackBuffer: createScale(),
    backBufferCtx: {
      beginPath: jest.fn(),
      closePath: jest.fn(),
      stroke: jest.fn(),
      fill: jest.fn(),
      moveTo: jest.fn(),
      lineTo: jest.fn(),
      save: jest.fn(),
      restore: jest.fn(),
      fillRect: jest.fn(),

      stokeStyle: '#fff',
      lineWidth: 1,
      markerPaneHeight: 1
    }
  } as unknown) as RenderConfig;
  let scale = createScale();
  const color = '#15f4ee';

  beforeEach(() => {
    jest.clearAllMocks();
    scale = createScale();
  });

  it.each([null, undefined, []])('does not render anything if dataSeries is %s', dS => {
    // Given
    const dataSeries = dS as DataSeries;

    // When
    stairway.render({
      config,
      dataSeries
    } as RenderProps);

    // Then
    expect(config.backBufferCtx.beginPath).not.toHaveBeenCalled();
  });

  it('draws a dot if only a single data point is available', () => {
    // Given
    const x = 2;
    const y = 4;
    const dataSeries: DataSeries = [[x, y]];
    const color = '#15f4ee';

    // When
    stairway.render({
      config,
      dataSeries,
      color,
      scale
    } as RenderProps);

    // Then
    expect(config.backBufferCtx.beginPath).toHaveBeenCalledTimes(1);
    expect(drawPoint).toHaveBeenCalledTimes(1);
    expect(drawPoint).toHaveBeenCalledWith(config, 2, 4, '#15f4ee');
    expect(config.backBufferCtx.stroke).toHaveBeenCalledTimes(1);
  });

  it('draws the metric shifted by half a bucket to the left', () => {
    // Given
    const dataSeries: DataSeries = [
      [2, 4],
      [4, 8]
    ];

    // When
    stairway.render({
      config,
      dataSeries,
      color,
      scale
    });

    // Then
    expect(config.backBufferCtx.beginPath).toHaveBeenCalledTimes(1);
    expect(config.backBufferCtx.moveTo).toHaveBeenCalledWith(0, 0);
    expect(config.backBufferCtx.lineTo).toHaveBeenNthCalledWith(1, 1, 0);
    expect(config.backBufferCtx.lineTo).toHaveBeenNthCalledWith(2, 1, 4);
    expect(config.backBufferCtx.lineTo).toHaveBeenNthCalledWith(3, 3, 4);
    expect(config.backBufferCtx.lineTo).toHaveBeenNthCalledWith(4, 3, 8);
    expect(config.backBufferCtx.stroke).toHaveBeenCalledTimes(1);
  });

  it('draws first value as is if isStaticBudget is true', () => {
    // Given
    const dataSeries: DataSeries = [
      [2, 4],
      [4, 8]
    ];
    const cfg = {
      ...config,
      y1: {
        ...config.y1,
        isStaticBudget: true
      }
    };

    // When
    stairway.render({
      config: cfg,
      dataSeries,
      color,
      scale
    });

    // Then
    expect(config.backBufferCtx.beginPath).toHaveBeenCalledTimes(1);
    expect(config.backBufferCtx.moveTo).toHaveBeenCalledWith(0, 4);
    expect(config.backBufferCtx.lineTo).toHaveBeenNthCalledWith(1, 1, 4);
    expect(config.backBufferCtx.lineTo).toHaveBeenNthCalledWith(2, 3, 4);
    expect(config.backBufferCtx.lineTo).toHaveBeenNthCalledWith(3, 3, 8);
    expect(config.backBufferCtx.stroke).toHaveBeenCalledTimes(1);
  });

  it('continues to draw the final data point for an additional bucket to the right', () => {
    // Given
    const dataSeries: DataSeries = [
      [2, 4],
      [4, 8]
    ];

    // When
    stairway.render({
      config,
      dataSeries,
      color,
      scale
    });

    // Then
    expect(config.backBufferCtx.lineTo).toHaveBeenNthCalledWith(4, 3, 8);
    expect(config.backBufferCtx.lineTo).toHaveBeenNthCalledWith(5, 5, 8);
  });

  it('fills the area under the graph if fillTopBackground is enabled for the metricId', () => {
    // Given
    const metricId = 'snackBudget';
    const dataSeries: DataSeries = [
      [2, 4],
      [4, 8]
    ];
    const cfg = {
      ...config,
      markerPaneHeight: 0.5
    };
    const renderer = useStairwayRenderer({
      metricConfiguration: {
        snackBudget: { fillTopBackground: true }
      }
    });

    // When
    renderer.render({
      config: cfg,
      dataSeries,
      color,
      scale,
      metricId
    });

    // Then
    expect(config.backBufferCtx.beginPath).toHaveBeenCalledTimes(2);
    expect(config.backBufferCtx.closePath).toHaveBeenCalledTimes(1);
    expect(config.backBufferCtx.fill).toHaveBeenCalledTimes(1);
    expect(config.backBufferCtx.moveTo).toHaveBeenCalledWith(0, 0);
    expect(config.backBufferCtx.lineTo).toHaveBeenNthCalledWith(6, 1, 0);
    expect(config.backBufferCtx.lineTo).toHaveBeenNthCalledWith(7, 1, 4);
    expect(config.backBufferCtx.lineTo).toHaveBeenNthCalledWith(8, 3, 4);
    expect(config.backBufferCtx.lineTo).toHaveBeenNthCalledWith(9, 3, 8);
    expect(config.backBufferCtx.lineTo).toHaveBeenNthCalledWith(10, 5, 8);
    expect(config.backBufferCtx.lineTo).toHaveBeenNthCalledWith(11, 5, 0.5);
    expect(config.backBufferCtx.lineTo).toHaveBeenNthCalledWith(12, 0, 0.5);
  });

  it('marks the area before the firstCollectedMetricTimestamp by overlaying it with a rect', () => {
    // Given
    const dataSeries: DataSeries = [
      [2, 4],
      [4, 8],
      [6, 16]
    ];
    const cfg = {
      ...config,
      height: 20,
      markerPaneHeight: 5,
      timeAxisHeight: 2.5
    };
    const renderer = useStairwayRenderer({
      firstCollectedMetricTimestamp: 2
    });

    // When
    renderer.render({
      config: cfg,
      dataSeries,
      color,
      scale
    });

    // Then
    expect(config.backBufferCtx.fillRect).toHaveBeenCalledWith(0, 5 - 1, 2, 20 - 5 - 2.5 + 1);
  });
});
