/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { shallow } from 'enzyme';
import React from 'react';

import {
  InfraMetricGroupHeader,
  InfraMetricGroupHeaderProps
} from 'in-alerting/smart-alerts/infrastructure/components/InfraMetricGroupHeader';
import SearchInput from 'in-components/SearchInput/SearchInput';
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

describe('in-alerting/smart-alerts/infrastructure/components/InfraMetricGroupHeader.tsx', () => {
  it('renders correctly when loading', () => {
    const props: InfraMetricGroupHeaderProps = {
      isLoading: true,
      totalHits: 0,
      setBackendQueryModel: jest.fn()
    };

    const wrapper = shallow(<InfraMetricGroupHeader {...props} />);

    expect(wrapper.text()).toContain(t('in-alerting:smartAlerts.infrastructure.resultHeaderLoading'));
  });

  it('renders correctly when there are results', () => {
    const props: InfraMetricGroupHeaderProps = {
      isLoading: false,
      totalHits: 100,
      setBackendQueryModel: jest.fn()
    };

    const wrapper = shallow(<InfraMetricGroupHeader {...props} />);

    const topText = t('in-alerting:smartAlerts.infrastructure.groupedViewHeader', {
      count: 100,
      formattedCount: number.compact(100)
    });

    expect(wrapper.text()).toContain(topText);

    wrapper.find(SearchInput).simulate('change', { target: { value: 'awesomeNewEndpoint' } });
  });
});
