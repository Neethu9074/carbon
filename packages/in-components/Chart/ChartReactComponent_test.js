/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { mount } from 'enzyme';
import React from 'react';

import ChartReactComponent from 'in-components/Chart/ChartReactComponent';
import Chart from 'in-components/Chart/Chart';

jest.mock('in-hooks/useResizeObserver', () => {
  return {
    __esModule: true,
    default: jest.fn(() => ({ width: 100 }))
  };
});
jest.mock('in-components/Chart/components/ChartOverlay', () => {
  return {
    __esModule: true,
    default: jest.fn(() => <div />)
  };
});
jest.mock('in-components/Chart/components/ChartLegend', () => {
  return {
    __esModule: true,
    default: jest.fn(() => <div />)
  };
});
jest.mock('in-components/Chart/Chart', () => {
  const { just } = jest.requireActual('@instana/observables');
  const { default: createScale } = jest.requireActual('in-services/scale/scale');
  return {
    __esModule: true,
    default: jest.fn((canvas, chartProps) => {
      return {
        canvas,
        config: {
          timeAxisHeight: chartProps.height,
          markerPaneHeight: chartProps.height,
          rollup: 10
        },
        renderScheduler: {
          xScaleBackBuffer$: just(createScale()),
          getRenderProps: () => ({
            xScaleBackBuffer: {
              getRangeArea: rollup => 10 * rollup
            }
          })
        },
        highlightedMoment: true,
        dispose: jest.fn(() => {}),
        update: () => {}
      };
    })
  };
});

describe('in-components/Chart/ChartReactComponent', () => {
  it('Internal chart should be disposed during unmount', async () => {
    const timeConfig = {
      to: 5000,
      windowSize: 1000
    };

    const wrapper = mount(<ChartReactComponent timeConfig={timeConfig} width={100} customHeight={100} />);

    // clear potential dispose calls from mounting or switching the canvas
    Chart.mock.results[0].value.dispose.mockClear();

    wrapper.unmount();

    expect(Chart.mock.results[0].value.dispose).toHaveBeenCalled();
  });
});
