/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { shallow } from 'enzyme';
import React from 'react';

import FormComponentHeader from 'in-custom-dashboards/widgets/Slo/components/FormComponentHeader';
import FeatureFeedback from 'in-components/FeatureFeedback';

describe('in-custom-dashboards/widgets/Slo/components/FormComponentHeader', () => {
  it("doesn't render FeatureFeedback component", () => {
    const wrapper = shallow(<FormComponentHeader href="" />);

    expect(wrapper.find(FeatureFeedback).length).toBeFalsy();
  });
  it('renders FeatureFeedback component', () => {
    const wrapper = shallow(<FormComponentHeader href="" showFeedbackButton />);

    expect(wrapper.find(FeatureFeedback).length).toBeTruthy();
  });
});
