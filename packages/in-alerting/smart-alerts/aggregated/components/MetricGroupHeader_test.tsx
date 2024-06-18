/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { shallow } from 'enzyme';
import React from 'react';

import { SearchInput } from '@instana/components';

import MetricGroupHeader, {
  MetricGroupHeaderProps
} from 'in-alerting/smart-alerts/aggregated/components/MetricGroupHeader';
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

describe('in-alerting/smart-alerts/components/MetricGroupHeader.tsx', () => {
  it('renders correctly when loading', () => {
    const props: MetricGroupHeaderProps = {
      isLoading: true,
      totalHits: 0,
      setBackendQueryModel: jest.fn()
    };

    const wrapper = shallow(<MetricGroupHeader {...props} />);

    expect(wrapper.text()).toContain(t('in-alerting:components.resultHeaderLoading'));
  });

  it('renders correctly when there are results', () => {
    const props: MetricGroupHeaderProps = {
      isLoading: false,
      totalHits: 100,
      setBackendQueryModel: jest.fn()
    };

    const wrapper = shallow(<MetricGroupHeader {...props} />);

    const topText = t('in-alerting:components.groupedViewHeader', {
      count: 100,
      formattedCount: number.compact(100)
    });

    expect(wrapper.text()).toContain(topText);

    wrapper.find(SearchInput).simulate('change', { target: { value: 'awesomeNewEndpoint' } });
  });
});
