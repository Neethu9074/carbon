/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
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

    render(<MetricGroupHeader {...props} />);
    expect(screen.getByText(t('in-alerting:components.resultHeaderLoading'))).toBeInTheDocument();
  });

  it('renders correctly when there are results', () => {
    const props: MetricGroupHeaderProps = {
      isLoading: false,
      totalHits: 100,
      setBackendQueryModel: jest.fn()
    };

    render(<MetricGroupHeader {...props} />);
    const topText = t('in-alerting:components.groupedViewHeader', {
      count: 100,
      formattedCount: number.compact(100)
    });
    expect(screen.getByText(topText)).toBeInTheDocument();
    const wrapper = shallow(<MetricGroupHeader {...props} />);
    wrapper.find(SearchInput).simulate('change', { target: { value: 'awesomeNewEndpoint' } });
  });
});
