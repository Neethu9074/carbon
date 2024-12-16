/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { createField } from 'formalistic';
import { shallow } from 'enzyme';
import React from 'react';

import { OverridingFieldValidationMessage } from 'in-custom-dashboards/widgets/SloLegacy/components/OverridingFieldValidationMessage';

describe('in-custom-dashboards/widgets/SloLegacy/components/OverridingFieldValidationMessage', () => {
  it('does not render itself if field is invalid, but not touched', () => {
    // GIVEN
    const message = 'This should not appear';
    const field = createField<string>({
      value: '',
      validator: () => [{ message: 'Always invalid', severity: 'error' }]
    }).setTouched(false);

    // WHEN
    const wrapper = shallow(<OverridingFieldValidationMessage field={field} message={message} />);

    // THEN
    expect(wrapper.getElement()).not.toBeTruthy();
  });

  it('does not render itself if field is valid and touched', () => {
    // GIVEN
    const message = 'This should not appear';
    const field = createField<string>({
      value: '',
      validator: () => null
    }).setTouched(true);

    // WHEN
    const wrapper = shallow(<OverridingFieldValidationMessage field={field} message={message} />);

    // THEN
    expect(wrapper.getElement()).not.toBeTruthy();
  });

  it('renders message if field is invalid and touched', () => {
    // GIVEN
    const message = 'This should appear';
    const field = createField<string>({
      value: '',
      validator: () => [{ message: 'Always invalid', severity: 'error' }]
    }).setTouched(true);

    // WHEN
    const wrapper = shallow(<OverridingFieldValidationMessage field={field} message={message} />);

    // THEN
    expect(wrapper.contains('This should appear')).toBeTruthy();
  });
});
