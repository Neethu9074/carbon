/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { shallow } from 'enzyme';
import React from 'react';

import PercentageInput from 'in-service-levels/components/PercentageInput';
import { noop } from 'in-services/fixedObjects';
import Input from 'in-components/form/Input';

describe('in-custom-dashboards/widgets/SloLegacy/components/PercentageInput', () => {
  it(`displays it's value as a percentage`, () => {
    // GIVEN
    const value = 0.1234;

    // WHEN
    const wrapper = shallow(<PercentageInput value={value} id="abc" onChange={noop} />);

    // THEN
    expect(wrapper.find(Input).prop('value')).toEqual(12.34);
  });

  it(`converts percentage input to floating point representaion`, () => {
    // GIVEN
    const value = 0.1234;
    const onChange = jest.fn();

    // WHEN
    const wrapper = shallow(<PercentageInput value={value} id="abc" onChange={onChange} />);
    wrapper.find(Input).simulate('change', {
      target: {
        valueAsNumber: 22.34
      }
    });

    // THEN
    expect(onChange).toHaveBeenCalledWith(0.2234);
  });

  it(`truncates input to specified decimal precision`, () => {
    // GIVEN
    const value = 0.1234;
    const decimalPrecision = 2;
    const onChange = jest.fn();

    // WHEN
    const wrapper = shallow(
      <PercentageInput value={value} id="abc" decimalPrecision={decimalPrecision} onChange={onChange} />
    );
    wrapper.find(Input).simulate('change', {
      target: {
        valueAsNumber: 22.3456
      }
    });

    // THEN
    expect(onChange).toHaveBeenCalledWith(0.2234);
  });

  it(`should call onChange with undefined if input is NaN`, () => {
    // GIVEN
    const value = 0.1234;
    const onChange = jest.fn();

    // WHEN
    const wrapper = shallow(<PercentageInput value={value} id="abc" onChange={onChange} />);
    wrapper.find(Input).simulate('change', {
      target: {
        valueAsNumber: Number.NaN // for example if user enters a string
      }
    });

    // THEN
    expect(onChange).toHaveBeenCalledWith(undefined);
  });

  it(`automatically adjusts step size to the number of digits of the formatted value`, () => {
    // GIVEN
    const value1 = 0.12; // 12%
    const value2 = 0.1234; // 12.34%

    // WHEN
    const wrapper1 = shallow(<PercentageInput value={value1} id="abc" onChange={noop} />);
    const wrapper2 = shallow(<PercentageInput value={value2} id="abc" onChange={noop} />);

    // THEN
    expect(wrapper1.find(Input).prop('step')).toEqual(1);
    expect(wrapper2.find(Input).prop('step')).toEqual(0.01);
  });

  it(`correctly propagates error state and id`, () => {
    // GIVEN
    const id = 'abc';
    const hasError = true;

    // WHEN
    const wrapper = shallow(<PercentageInput value={undefined} id={id} hasError={hasError} onChange={noop} />);

    // THEN
    expect(wrapper.find(Input).prop('id')).toEqual('abc');
    expect(wrapper.find(Input).prop('hasError')).toBeTruthy();
  });
});
