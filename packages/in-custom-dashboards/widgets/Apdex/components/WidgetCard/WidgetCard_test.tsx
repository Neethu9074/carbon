/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { shallow } from 'enzyme';
import React from 'react';

import { HorizontalIndicator } from '@instana/components';

import WidgetCard from 'in-custom-dashboards/widgets/Apdex/components/WidgetCard';

describe('in-custom-dashboards/widgets/Apdex/components/WidgetCard', () => {
  it("should render no loading indicator if loading isn't in progress.", async () => {
    const isLoading = false;

    const wrapper = shallow(
      <WidgetCard progress={{ loading: isLoading }}>
        <div id="body" />
      </WidgetCard>
    );

    expect(wrapper.find(HorizontalIndicator)).toHaveLength(0);
    expect(wrapper.find('#body')).toHaveLength(1);
  });

  it('should render loading indicator if loading is in progress.', async () => {
    const isLoading = true;

    const wrapper = shallow(
      <WidgetCard progress={{ loading: isLoading }}>
        <div id="body" />
      </WidgetCard>
    );

    expect(wrapper.find(HorizontalIndicator)).toHaveLength(1);
    expect(wrapper.find('#body')).toHaveLength(1);
  });
});
