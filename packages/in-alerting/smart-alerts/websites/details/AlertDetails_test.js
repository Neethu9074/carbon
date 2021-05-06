/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

/* eslint-env mocha */

// ...to.be.true is a valid syntax in chai, but eslint complains, so we turn this off
/* eslint-disable babel/no-unused-expressions */

import proxyquire from 'proxyquire';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import React from 'react';
import sinon from 'sinon';

const location = {
  pathname: '',
  matrix: {}
};

const timeConfig = {
  windowSize: 123
};

describe('Alert Details', () => {
  const alertConfigFunctions = {
    getAlertConfigByIdAndTimestamp: sinon.fake(),
    getLatestAlertConfig: sinon.fake()
  };

  const AlertDetails = proxyquire('in-alerting/smart-alerts/websites/details/AlertDetails', {
    'in-websites/api/websiteAlertConfig': alertConfigFunctions
  }).default;

  it('prop getConfig should call getAlertConfigByIdAndTimestamp() for smart alert with created date', () => {
    const wrapper = shallow(<AlertDetails location={location} timeConfig={timeConfig} />);

    const actualGetConfig = wrapper.prop('getConfig');
    const timestamp = Date.now();

    actualGetConfig('123', timestamp);

    expect(alertConfigFunctions.getAlertConfigByIdAndTimestamp.callCount).to.be.equal(1);
    expect(alertConfigFunctions.getAlertConfigByIdAndTimestamp.getCall(0).calledWith('123', timestamp)).to.be.true;
  });

  it('prop getConfig should call getLatestAlertConfig() for smart alert', () => {
    const wrapper = shallow(<AlertDetails location={location} timeConfig={timeConfig} />);

    const actualGetConfig = wrapper.prop('getConfig');
    actualGetConfig('123');

    expect(alertConfigFunctions.getLatestAlertConfig.callCount).to.be.equal(1);
    expect(alertConfigFunctions.getLatestAlertConfig.getCall(0).calledWith('123')).to.be.true;
  });
});
