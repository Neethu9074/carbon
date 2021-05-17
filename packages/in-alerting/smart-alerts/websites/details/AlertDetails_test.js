/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

/* eslint-env jest */

import { shallow } from 'enzyme';
import React from 'react';

import { getAlertConfigByIdAndTimestamp, getLatestAlertConfig } from 'in-websites/api/websiteAlertConfig';
import AlertDetails from 'in-alerting/smart-alerts/websites/details/AlertDetails';

jest.mock('in-websites/api/websiteAlertConfig');

const location = {
  pathname: '',
  matrix: {}
};

const timeConfig = {
  windowSize: 123
};

const asObservable = {
  asObservable: true
};

describe('Alert Details', () => {
  it('prop getConfig should call getAlertConfigByIdAndTimestamp() for smart alert with created date', () => {
    const wrapper = shallow(<AlertDetails location={location} timeConfig={timeConfig} />);

    const actualGetConfig = wrapper.prop('getConfig');
    const timestamp = Date.now();

    actualGetConfig('123', timestamp);

    expect(getAlertConfigByIdAndTimestamp).toHaveBeenCalledTimes(1);
    expect(getAlertConfigByIdAndTimestamp).toHaveBeenLastCalledWith('123', timestamp, asObservable);
  });

  it('prop getConfig should call getLatestAlertConfig() for smart alert', () => {
    const wrapper = shallow(<AlertDetails location={location} timeConfig={timeConfig} />);

    const actualGetConfig = wrapper.prop('getConfig');
    actualGetConfig('123');

    expect(getLatestAlertConfig).toHaveBeenCalledTimes(1);
    expect(getLatestAlertConfig).toHaveBeenLastCalledWith('123', asObservable);
  });
});
