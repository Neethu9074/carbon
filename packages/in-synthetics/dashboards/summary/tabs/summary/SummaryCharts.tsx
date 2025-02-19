/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import MarkerLanesSynthetic from 'in-synthetics/dashboards/summary/tabs/summary/components/MarkerLanesSynthetic';
import ResultsTopList from 'in-synthetics/dashboards/summary/tabs/summary/components/ResultsTopList';
import ResponseStatus from 'in-synthetics/dashboards/summary/tabs/summary/components/ResponseStatus';
import NetworkTimings from 'in-synthetics/dashboards/summary/tabs/summary/components/NetworkTiming';
import ResponseTime from 'in-synthetics/dashboards/summary/tabs/summary/components/ResponseTime';
import ResponseSize from 'in-synthetics/dashboards/summary/tabs/summary/components/ResponseSize';
import Failures from 'in-synthetics/dashboards/summary/tabs/summary/components/Failures';
import { TestResponse } from 'in-synthetics/utils/constants';
import { TimeShift } from 'in-components/Chart/types';
import { Col, Row } from 'in-components/layout/Grid';

interface SummaryChartsProps {
  testId: string;
  testType: string | null | undefined;
  test: TestResponse;
  locationIds: string;
  locationDisplayLabels: string;
  timeShiftConfig: TimeShift;
}

export default function SummaryCharts({
  testId,
  testType,
  test,
  locationIds,
  locationDisplayLabels,
  timeShiftConfig
}: SummaryChartsProps) {
  const MarkerLanes = MarkerLanesSynthetic({ testId });

  const failuresChart = (
    <Col xs key="failures">
      <Failures
        testId={testId}
        locationIds={locationIds}
        locationDisplayLabels={locationDisplayLabels}
        timeShiftConfig={timeShiftConfig}
        renderPostChartContent={MarkerLanes}
      />
    </Col>
  );

  const responseTimeChart = (
    <Col xs key="responseTime">
      <ResponseTime
        testId={testId}
        locationIds={locationIds}
        locationDisplayLabels={locationDisplayLabels}
        timeShiftConfig={timeShiftConfig}
        renderPostChartContent={MarkerLanes}
      />
    </Col>
  );

  const responseSizeChart = (
    <Col lg key="responseSize">
      <ResponseSize
        testId={testId}
        locationIds={locationIds}
        locationDisplayLabels={locationDisplayLabels}
        timeShiftConfig={timeShiftConfig}
        renderPostChartContent={MarkerLanes}
      />
    </Col>
  );

  const resultsChart = (
    <Col xs key="results">
      <ResultsTopList testId={testId} />
    </Col>
  );

  const responseStatusChart = (
    <Col lg key="responseStatus">
      <ResponseStatus test={test} />
    </Col>
  );

  const networkTimingsChart = (
    <Col xs key="networkTimings">
      <NetworkTimings
        testId={testId}
        locationIds={locationIds}
        locationDisplayLabels={locationDisplayLabels}
        timeShiftConfig={timeShiftConfig}
        renderPostChartContent={MarkerLanes}
      />
    </Col>
  );

  const commonCharts = [failuresChart, responseTimeChart];

  /**
   * Construct the array containing the common charts for Summary view
   * @returns {JSX.Element[]} Array of Failures, Results and Response Time charts
   */
  const getChartsForSslAndDNSAction = () => {
    commonCharts.splice(1, 0, resultsChart);
    return commonCharts;
  };

  /**
   * Construct the array containing the common charts for Summary view
   * @returns {JSX.Element[]} Array of Failures, Response Time, Network Timings, Response Size, Results and Response Status charts
   */
  const getChartsForHTTPAction = () => {
    commonCharts.splice(2, 0, networkTimingsChart);
    commonCharts.splice(3, 0, responseSizeChart);
    commonCharts.splice(4, 0, resultsChart);
    commonCharts.splice(5, 0, responseStatusChart);
    return commonCharts;
  };

  /**
   * Construct the array containing the common charts for Summary view
   * @returns {JSX.Element[]} Array of Failures, Response Time, Response Size and Results charts
   */
  const getChartsForOthers = () => {
    commonCharts.splice(2, 0, responseSizeChart);
    commonCharts.splice(3, 0, resultsChart);
    return commonCharts;
  };

  const getChartsToRender = () => {
    switch (testType) {
      case 'HTTPAction': {
        const chartsForHTTPAction = getChartsForHTTPAction();
        return (
          <>
            <Row>{chartsForHTTPAction.slice(0, 3)}</Row>
            <Row>{chartsForHTTPAction.slice(3)}</Row>
          </>
        );
      }
      case 'SSLCertificate':
      case 'DNSAction': {
        const chartsForSslAndDNSAction = getChartsForSslAndDNSAction();
        return <Row>{chartsForSslAndDNSAction}</Row>;
      }
      default: {
        const chartsForOthers = getChartsForOthers();
        return (
          <>
            <Row>{chartsForOthers.slice(0, 2)}</Row>
            <Row>{chartsForOthers.slice(2)}</Row>
          </>
        );
      }
    }
  };

  return getChartsToRender();
}
