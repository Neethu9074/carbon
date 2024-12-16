/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import { shallow } from 'enzyme';
import React from 'react';

import SliSummarySkeleton from 'in-custom-dashboards/widgets/SloLegacy/components/SliSummary/SliSummarySkeleton';
import SloTimeTile from 'in-custom-dashboards/widgets/SloLegacy/components/widget/tiles/SloTimeTile';
import { useSliFormatter } from 'in-custom-dashboards/widgets/SloLegacy/hooks/useSliFormatter';
import SloTile from 'in-custom-dashboards/widgets/SloLegacy/components/widget/tiles/SloTile';
import SliSummary from 'in-custom-dashboards/widgets/SloLegacy/components/SliSummary';
import useMediaQuery from 'in-hooks/useMediaQuery';
import { days } from 'in-services/time';
import { t } from 'in-i18n';

import locals from './SliSummary.mless';

jest.mock('in-hooks/useMediaQuery', () => ({
  ...jest.requireActual('in-hooks/useMediaQuery'),
  default: jest.fn(),
  __esModule: true
}));

jest.mock('in-custom-dashboards/widgets/SloLegacy/hooks/useSliFormatter', () => ({
  ...jest.requireActual('in-custom-dashboards/widgets/SloLegacy/hooks/useSliFormatter'),
  useSliFormatter: jest.fn(),
  __esModule: true
}));

describe('in-custom-dashboards/widgets/SloLegacy/components/SliSummary', () => {
  beforeEach(jest.clearAllMocks);

  const now = Date.now();
  const defaultProps = { fromTimestamp: now, toTimestamp: now + days.toMillis(1) };

  it('should only contain a skeleton component if status is pending', () => {
    const wrapper = shallow(<SliSummary {...defaultProps} status="pending" />);

    expect(wrapper.find(SliSummarySkeleton)).toHaveLength(1);
    expect(wrapper.find(SloTile)).toHaveLength(0);
    expect(wrapper.find(SloTimeTile)).toHaveLength(0);
  });

  it('should render two SloTiles and one SliTimeTile if no status is given', () => {
    const wrapper = shallow(<SliSummary {...defaultProps} />);

    expect(wrapper.find(SliSummarySkeleton)).toHaveLength(0);
    expect(wrapper.find(SloTile)).toHaveLength(2);
    expect(wrapper.find(SloTimeTile)).toHaveLength(1);
  });

  it('should have budgetSpent set to false for all SloTiles if slo is not set', () => {
    const wrapper = shallow(<SliSummary {...defaultProps} />);

    expect(wrapper.find(SloTile).first().prop('budgetSpent')).toEqual(false);
    expect(wrapper.find(SloTile).last().prop('budgetSpent')).toEqual(false);
  });

  it.each`
    expectedTarget | expectedStatus | givenSlo      | givenMetricSli
    ${'100.00%'}   | ${'100.00%'}   | ${1}          | ${1}
    ${'99.88%'}    | ${'99.99%'}    | ${0.99888}    | ${0.999911}
    ${'99.99%'}    | ${'99.99%'}    | ${0.999995}   | ${0.999996}
    ${'99.99%'}    | ${'100.00%'}   | ${0.999999}   | ${1}
    ${'99.99%'}    | ${'100.00%'}   | ${0.99999995} | ${1}
    ${'300.00%'}   | ${'299.94%'}   | ${3}          | ${2.99948}
  `(
    'should have target of $expectedTarget and status of $expectedStatus if slo is $givenSlo and metricSli is $givenMetricSli',
    ({ expectedTarget, expectedStatus, givenSlo, givenMetricSli }) => {
      useSliFormatter.mockReturnValueOnce(() => 'foo');

      const wrapper = shallow(<SliSummary {...defaultProps} slo={givenSlo} metricSli={givenMetricSli} />);

      expect(wrapper.find(SloTile).first().prop('value')).toEqual(expectedStatus);

      expect(wrapper.find(SloTile).first().prop('budget')).toEqual(expectedTarget);
    }
  );

  it('should have budgetSpent set to true on first SloTile if slo and metricSli are given', () => {
    useSliFormatter.mockReturnValueOnce(() => 'foo');

    const wrapper = shallow(<SliSummary {...defaultProps} slo={3} metricSli={1} />);
    expect(wrapper.find(SloTile).first().prop('budgetSpent')).toEqual(true);
  });

  it('should have value set to undefined on second SloTile if slo and metricSli are given', () => {
    useSliFormatter.mockReturnValueOnce(() => 'foo');

    const wrapper = shallow(<SliSummary {...defaultProps} slo={3} metricSli={1} />);
    expect(wrapper.find(SloTile).last().prop('value')).toBeUndefined();
  });

  it('should have budgetSpent set to false on second SloTile if slo and metricSli are given', () => {
    useSliFormatter.mockReturnValueOnce(() => 'foo');

    const wrapper = shallow(<SliSummary {...defaultProps} slo={3} metricSli={1} />);
    expect(wrapper.find(SloTile).last().prop('budgetSpent')).toEqual(false);
  });

  it('should render correctly if metricSpent is set', () => {
    useSliFormatter.mockReturnValueOnce(() => '1min');

    const wrapper = shallow(<SliSummary {...defaultProps} metricSpent={1} />);

    expect(wrapper.find(SloTile).last().prop('value')).toEqual('1min');
  });

  it('should render correctly if there is some budget given', () => {
    useSliFormatter.mockReturnValueOnce(() => '1min');

    const wrapper = shallow(<SliSummary {...defaultProps} budget={1} />);

    expect(wrapper.find(SloTile).last().prop('budget')).toEqual('1min');
  });

  it('should render correctly if no remaining budget is available', () => {
    const wrapper = shallow(<SliSummary {...defaultProps} metricRemaining={0} />);

    expect(wrapper.find(SloTile).last().prop('budgetSpent')).toEqual(true);
  });

  it('should render correct label if time window type is dynamic', () => {
    const wrapper = shallow(<SliSummary {...defaultProps} timeWindowType="dynamic" />);

    expect(wrapper.find(SloTimeTile).prop('timeFrameLabel')).toEqual(
      t('in-custom-dashboards:widgets.slo.sliSummary.timeWindowType', {
        context: 'dynamic'
      })
    );
  });

  it('should render correct label if time window type is rolling', () => {
    const wrapper = shallow(<SliSummary {...defaultProps} timeWindowType="rolling" />);

    expect(wrapper.find(SloTimeTile).prop('timeFrameLabel')).toEqual(
      t('in-custom-dashboards:widgets.slo.sliSummary.timeWindowType', {
        context: 'rolling'
      })
    );
  });

  it('should render correct label if time window type is fixed', () => {
    const wrapper = shallow(<SliSummary {...defaultProps} timeWindowType="fixed" />);

    expect(wrapper.find(SloTimeTile).prop('timeFrameLabel')).toEqual(
      t('in-custom-dashboards:widgets.slo.sliSummary.timeWindowType', {
        context: 'fixed'
      })
    );
  });

  it('should render compact SloTiles if media query condition is not met', () => {
    useMediaQuery.mockImplementation(mediaQuery => mediaQuery !== '(min-width: 1300px)');

    const wrapper = shallow(<SliSummary {...defaultProps} />);

    expect(wrapper.find('div').prop('className')).toEqual(locals.listContainer);
    expect(wrapper.find(SloTile).first().prop('compact')).toEqual(true);
    expect(wrapper.find(SloTile).last().prop('compact')).toEqual(true);
    expect(wrapper.find(SloTimeTile).prop('compact')).toEqual(true);
  });
  it('should render normal SloTiles if media query condition is met', () => {
    useMediaQuery.mockImplementation(mediaQuery => mediaQuery === '(min-width: 1300px)');

    const wrapper = shallow(<SliSummary {...defaultProps} />);

    expect(wrapper.find('div').prop('className')).toEqual(locals.tilesContainer);
    expect(wrapper.find(SloTile).first().prop('compact')).toEqual(false);
    expect(wrapper.find(SloTile).last().prop('compact')).toEqual(false);
    expect(wrapper.find(SloTimeTile).prop('compact')).toEqual(false);
  });
});
