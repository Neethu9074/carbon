/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { shallow } from 'enzyme';
import React from 'react';

import { TimeWindowType } from '@instana/types';

import SloChartSummarySkeleton from 'in-service-levels/components/SloChart/SloChartSummary/SloChartSummarySkeleton';
import SloChartSummary from 'in-service-levels/components/SloChart/SloChartSummary/SloChartSummary';
import useSloFormatter, { SloFormatterFunction } from 'in-service-levels/hooks/useSloFormatter';
import SloTimeTile from 'in-service-levels/components/SloChart/SloChartTiles/SloTimeTile';
import SloTile from 'in-service-levels/components/SloChart/SloChartTiles/SloTile';
import { MetricDataPoint } from 'in-components/Chart/types';
import useMediaQuery from 'in-hooks/useMediaQuery';
import { days } from 'in-services/time';
import { t } from 'in-i18n';

import locals from './SloChartSummary.mless';

jest.mock('in-hooks/useMediaQuery', () => ({
  ...jest.requireActual('in-hooks/useMediaQuery'),
  default: jest.fn(),
  __esModule: true
}));
jest.mock('in-service-levels/hooks/useSloFormatter', () => ({
  ...jest.requireActual('in-service-levels/hooks/useSloFormatter'),
  default: jest.fn(),
  __esModule: true
}));

const mockedUseMediaQuery = useMediaQuery as jest.Mock<boolean>;

const mockedUseSloFormatter = useSloFormatter as jest.Mock<SloFormatterFunction>;

describe('in-service-levels/components/SloChart/SloChartSummary/SloChartSummary', () => {
  beforeEach(jest.clearAllMocks);

  const now = Date.now();
  const defaultProps = {
    fromTimestamp: now,
    objectiveDuration: 2,
    objectiveDurationUnit: 'week',
    toTimestamp: now + days.toMillis(1),
    timeWindowType: 'fixed' as TimeWindowType,
    statusSingleNumber: [[1, 2]] as MetricDataPoint[]
  };

  it('should only contain a skeleton component if status is pending', () => {
    const wrapper = shallow(<SloChartSummary {...defaultProps} status="pending" />);

    expect(wrapper.find(SloChartSummarySkeleton)).toHaveLength(1);
    expect(wrapper.find(SloTile)).toHaveLength(0);
    expect(wrapper.find(SloTimeTile)).toHaveLength(0);
  });

  it('should render two SloTiles and one SliTimeTile if no status is given', () => {
    const wrapper = shallow(<SloChartSummary {...defaultProps} />);

    expect(wrapper.find(SloChartSummarySkeleton)).toHaveLength(0);
    expect(wrapper.find(SloTile)).toHaveLength(2);
    expect(wrapper.find(SloTimeTile)).toHaveLength(1);
  });

  it('should have budgetSpent set to false for all SloTiles if slo is not set', () => {
    const wrapper = shallow(<SloChartSummary {...defaultProps} />);

    expect(wrapper.find(SloTile).first().prop('budgetSpent')).toEqual(false);
    expect(wrapper.find(SloTile).last().prop('budgetSpent')).toEqual(false);
  });

  it.each`
    expectedTarget | expectedStatus | target        | statusSingleNumber
    ${'100.00%'}   | ${'100.00%'}   | ${1}          | ${[[1, 1]]}
    ${'99.88%'}    | ${'99.99%'}    | ${0.99888}    | ${[[1, 0.999911]]}
    ${'99.99%'}    | ${'99.99%'}    | ${0.999995}   | ${[[1, 0.999996]]}
    ${'99.99%'}    | ${'100.00%'}   | ${0.999999}   | ${[[1, 1]]}
    ${'99.99%'}    | ${'100.00%'}   | ${0.99999995} | ${[[1, 1]]}
    ${'300.00%'}   | ${'299.94%'}   | ${3}          | ${[[1, 2.99948]]}
  `(
    'should have target of $expectedTarget and status of $expectedStatus if slo is $givenSlo and metricSli is $givenMetricSli',
    ({ expectedTarget, expectedStatus, target, statusSingleNumber }) => {
      mockedUseSloFormatter.mockReturnValueOnce(() => 'foo');

      const wrapper = shallow(
        <SloChartSummary {...defaultProps} target={target} statusSingleNumber={statusSingleNumber} />
      );

      expect(wrapper.find(SloTile).first().prop('value')).toEqual(expectedStatus);

      expect(wrapper.find(SloTile).first().prop('budget')).toEqual(expectedTarget);
    }
  );

  it('should have budgetSpent set to true on first SloTile if slo and metricSli are given', () => {
    mockedUseSloFormatter.mockReturnValueOnce(() => 'foo');

    const wrapper = shallow(<SloChartSummary {...defaultProps} target={3} metricSli={1} />);
    expect(wrapper.find(SloTile).first().prop('budgetSpent')).toEqual(true);
  });

  it('should have value set to undefined on second SloTile if slo and metricSli are given', () => {
    mockedUseSloFormatter.mockReturnValueOnce(() => 'foo');

    const wrapper = shallow(<SloChartSummary {...defaultProps} target={3} metricSli={1} />);
    expect(wrapper.find(SloTile).last().prop('value')).toBeUndefined();
  });

  it('should have budgetSpent set to false on second SloTile if slo and metricSli are given', () => {
    mockedUseSloFormatter.mockReturnValueOnce(() => 'foo');

    const wrapper = shallow(<SloChartSummary {...defaultProps} target={3} metricSli={1} />);
    expect(wrapper.find(SloTile).last().prop('budgetSpent')).toEqual(false);
  });

  it('should render correctly if metricSpent is set', () => {
    mockedUseSloFormatter.mockReturnValueOnce(() => '1min');

    const wrapper = shallow(<SloChartSummary {...defaultProps} consumedBudgetSingleNumber={[[1, 2]]} />);

    expect(wrapper.find(SloTile).last().prop('value')).toEqual('1min');
  });

  it('should render correctly if there is some budget given', () => {
    mockedUseSloFormatter.mockReturnValueOnce(() => '1min');

    const wrapper = shallow(<SloChartSummary {...defaultProps} budgetSingleNumber={[[1, 2]]} />);

    expect(wrapper.find(SloTile).last().prop('budget')).toEqual('1min');
  });

  it('should render correctly if no remaining budget is available', () => {
    const wrapper = shallow(<SloChartSummary {...defaultProps} metricRemaining={0} />);

    expect(wrapper.find(SloTile).last().prop('budgetSpent')).toEqual(true);
  });

  it('should render correct label if time window type is rolling', () => {
    const wrapper = shallow(<SloChartSummary {...defaultProps} timeWindowType="rolling" />);

    expect(wrapper.find(SloTimeTile).prop('timeFrameLabel')).toEqual(
      t('in-service-levels:sloChart.sloChartSummary.timeWindowType', {
        context: 'rolling'
      })
    );
  });

  it('should render correct label if time window type is fixed', () => {
    const wrapper = shallow(<SloChartSummary {...defaultProps} timeWindowType="fixed" />);

    expect(wrapper.find(SloTimeTile).prop('timeFrameLabel')).toEqual(
      t('in-service-levels:sloChart.sloChartSummary.timeWindowType', {
        context: 'fixed'
      })
    );
  });

  it('should render compact SloTiles if media query condition is not met', () => {
    mockedUseMediaQuery.mockImplementation(mediaQuery => mediaQuery !== '(min-width: 1300px)');

    const wrapper = shallow(<SloChartSummary {...defaultProps} />);

    expect(wrapper.find('div').prop('className')).toEqual(locals.listContainer);
    expect(wrapper.find(SloTile).first().prop('compact')).toEqual(true);
    expect(wrapper.find(SloTile).last().prop('compact')).toEqual(true);
    expect(wrapper.find(SloTimeTile).prop('compact')).toEqual(true);
  });
  it('should render normal SloTiles if media query condition is met', () => {
    mockedUseMediaQuery.mockImplementation(mediaQuery => mediaQuery === '(min-width: 1300px)');

    const wrapper = shallow(<SloChartSummary {...defaultProps} />);

    expect(wrapper.find('div').prop('className')).toEqual(locals.tilesContainer);
    expect(wrapper.find(SloTile).first().prop('compact')).toEqual(false);
    expect(wrapper.find(SloTile).last().prop('compact')).toEqual(false);
    expect(wrapper.find(SloTimeTile).prop('compact')).toEqual(false);
  });
});
