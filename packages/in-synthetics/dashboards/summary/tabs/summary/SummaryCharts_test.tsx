/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { cleanup, screen, render } from '@testing-library/react';
import React from 'react';

import { SyntheticTest } from '@instana/types';

import SummaryCharts from 'in-synthetics/dashboards/summary/tabs/summary/SummaryCharts';

describe(SummaryCharts, () => {
  afterEach(() => {
    cleanup();
  });

  const dummyTest = {
    data: {} as SyntheticTest,
    errors: [],
    progress: { loading: true }
  };

  it('Render correct set of charts for HTTPAction test', () => {
    render(
      <SummaryCharts
        testId={'Fy5VXstvyDZrrCjhNYXZ'}
        testType={'HTTPAction'}
        test={dummyTest}
        locationIds={'f7cEoG61DJfVyWcDnWsc,KHphVmZqqRf9Kp2xSoud'}
        locationDisplayLabels={'test-label1,test-label2'}
        timeShiftConfig={{ offset: 0 }}
      />
    );
    expect(screen.getByText('Failures')).toBeVisible();
    expect(screen.getByText('Response Times')).toBeVisible();
    expect(screen.getByText('Network Timings')).toBeVisible();
    expect(screen.getByText('Average Response Size')).toBeVisible();
    expect(screen.getByText('Results')).toBeVisible();
    expect(screen.getByText('Response Status')).toBeVisible();
    // test network timings pull down
    screen.getByText('test-label1').click();
    screen.getByText('test-label2').click();
    expect(screen.getByText('test-label2')).toBeVisible();
  });

  it('Render correct set of charts for HTTPScript test', () => {
    render(
      <SummaryCharts
        testId={'Fy5VXstvyDZrrCjhNYXZ'}
        testType={'HTTPScript'}
        test={dummyTest}
        locationIds={'f7cEoG61DJfVyWcDnWsc,,KHphVmZqqRf9Kp2xSoud'}
        locationDisplayLabels={'test-label1,test-label2'}
        timeShiftConfig={{ offset: 0 }}
      />
    );
    expect(screen.getByText('Failures')).toBeVisible();
    expect(screen.getByText('Response Times')).toBeVisible();
    expect(screen.getByText('Average Response Size')).toBeVisible();
    expect(screen.getByText('Results')).toBeVisible();

    expect(screen.queryByText('Network Timings')).toBeNull();
    expect(screen.queryByText('Response Status')).toBeNull();
  });

  it('Render correct set of charts for SSLCertificate test', () => {
    render(
      <SummaryCharts
        testId={'Fy5VXstvyDZrrCjhNYXZ'}
        testType={'SSLCertificate'}
        test={dummyTest}
        locationIds={'f7cEoG61DJfVyWcDnWsc,,KHphVmZqqRf9Kp2xSoud'}
        locationDisplayLabels={'test-label1,test-label2'}
        timeShiftConfig={{ offset: 0 }}
      />
    );
    expect(screen.getByText('Failures')).toBeVisible();
    expect(screen.getByText('Results')).toBeVisible();
    expect(screen.getByText('Response Times')).toBeVisible();

    expect(screen.queryByText('Avg. Response Size')).toBeNull();
    expect(screen.queryByText('Network Timings')).toBeNull();
    expect(screen.queryByText('Response Status')).toBeNull();
  });
});
