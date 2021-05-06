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

import {
  alertsTabDetailsFullyQualified,
  globalAlertDetails,
  alertsTabListFullyQualified,
  alertsList
} from 'in-applications/navigation/paths';

describe('Alert Details', () => {
  const globalAlertConfigFunctions = {
    getGlobalAlertConfigByIdAndTimestamp: sinon.fake(),
    getLatestGlobalAlertConfig: sinon.fake()
  };

  const individualAlertConfigFunctions = {
    getAlertConfigByIdAndTimestamp: sinon.fake(),
    getLatestAlertConfig: sinon.fake()
  };

  const AlertDetails = proxyquire('in-alerting/smart-alerts/applications/details/AlertDetails', {
    'in-alerting/smart-alerts/applications/api/globalApplicationAlertConfigs': globalAlertConfigFunctions,
    'in-alerting/smart-alerts/applications/api/applicationAlertConfig': individualAlertConfigFunctions
  }).default;

  it('should render <GlobalAlertDetails> if matrix param "configsCategory" is set to local', () => {
    const location = {
      pathname: '/alerts/details',
      matrix: {
        '/alerts': {
          configsCategory: 'global'
        }
      }
    };

    const wrapper = shallow(<AlertDetails location={location} />);

    expect(wrapper.find('GlobalAlertDetails')).to.have.lengthOf(1);
  });

  it('should render <IndividiualAlertDetails> if matrix param "configsCategory" is set to local', () => {
    const location = {
      pathname: '/alerts/details',
      matrix: {
        '/alerts': {
          configsCategory: 'local'
        }
      }
    };

    const wrapper = shallow(<AlertDetails location={location} />);

    expect(wrapper.find('IndividiualAlertDetails')).to.have.lengthOf(1);
  });

  it('should render <IndividiualAlertDetails> if matrix param "configsCategory" is abscent', () => {
    const location = {
      pathname: '/alerts/details',
      matrix: {}
    };

    const wrapper = shallow(<AlertDetails location={location} />);

    expect(wrapper.find('IndividiualAlertDetails')).to.have.lengthOf(1);
  });

  it('prop getConfig should call getGlobalAlertConfigByIdAndTimestamp() for global smart alert with created date', () => {
    const location = {
      pathname: '/alerts/details',
      matrix: {
        '/alerts': {
          configsCategory: 'global'
        }
      }
    };

    const wrapper = shallow(<AlertDetails location={location} />).dive();
    const timestamp = Date.now();

    const actualGetConfig = wrapper.prop('getConfig');
    actualGetConfig('123', timestamp);

    expect(globalAlertConfigFunctions.getGlobalAlertConfigByIdAndTimestamp.callCount).to.be.equal(1);
    expect(globalAlertConfigFunctions.getGlobalAlertConfigByIdAndTimestamp.getCall(0).calledWith('123', timestamp)).to
      .be.true;
  });

  it('prop getConfig should call getInventoryPathForLocation() for global smart alert', () => {
    const location = {
      pathname: '/alerts/details',
      matrix: {
        '/alerts': {
          configsCategory: 'global'
        }
      }
    };

    const wrapper = shallow(<AlertDetails location={location} />).dive();
    const actualGetConfig = wrapper.prop('getConfig');
    actualGetConfig('123');

    expect(globalAlertConfigFunctions.getLatestGlobalAlertConfig.callCount).to.be.equal(1);
    expect(globalAlertConfigFunctions.getLatestGlobalAlertConfig.getCall(0).calledWith('123')).to.be.true;
  });

  it('prop getConfig should call getAlertConfigByIdAndTimestamp() for individual smart alert with created date', () => {
    const location = {
      pathname: '/alerts/details',
      matrix: {}
    };

    const wrapper = shallow(<AlertDetails location={location} />).dive();
    const actualGetConfig = wrapper.prop('getConfig');
    const timeconfig = Date.now();
    actualGetConfig('123', timeconfig);

    expect(individualAlertConfigFunctions.getAlertConfigByIdAndTimestamp.callCount).to.be.equal(1);
    expect(individualAlertConfigFunctions.getAlertConfigByIdAndTimestamp.getCall(0).calledWith('123', timeconfig)).to.be
      .true;
  });

  it('prop getConfig should call getLatestAlertConfig() for individual smart alert', () => {
    const location = {
      pathname: '/alerts/details',
      matrix: {}
    };

    const wrapper = shallow(<AlertDetails location={location} />).dive();
    const actualGetConfig = wrapper.prop('getConfig');
    actualGetConfig('123');

    expect(individualAlertConfigFunctions.getLatestAlertConfig.callCount).to.be.equal(1);
    expect(individualAlertConfigFunctions.getLatestAlertConfig.getCall(0).calledWith('123')).to.be.true;
  });

  it('should have the correct prop paths.detailsPath for per-ap-inventory-tab', () => {
    const location = {
      pathname: '/application/alerts/details',
      matrix: {}
    };

    const wrapper = shallow(<AlertDetails location={location} />).dive();

    const actualDetailsPath = wrapper.prop('paths').detailsPath;
    expect(actualDetailsPath).to.be.equal(alertsTabDetailsFullyQualified);
  });

  it('should have correct prop paths.detailsPath for global-inventory-tab', () => {
    const location = {
      pathname: '/alerts/details',
      matrix: {}
    };

    const wrapper = shallow(<AlertDetails location={location} />).dive();

    const actualDetailsPath = wrapper.prop('paths').detailsPath;
    expect(actualDetailsPath).to.be.equal(globalAlertDetails);
  });

  it('should have the correct prop paths.listPath for per-ap-inventory-tab', () => {
    const location = {
      pathname: '/application/alerts/details',
      matrix: {}
    };

    const wrapper = shallow(<AlertDetails location={location} />).dive();

    const actualListPath = wrapper.prop('paths').listPath;
    expect(actualListPath).to.be.equal(alertsTabListFullyQualified);
  });

  it('should have the correct prop paths.listPath for global-inventory-tab', () => {
    const location = {
      pathname: '/alerts/details',
      matrix: {}
    };

    const wrapper = shallow(<AlertDetails location={location} />).dive();

    const actualListPath = wrapper.prop('paths').listPath;
    expect(actualListPath).to.be.equal(alertsList);
  });
});
