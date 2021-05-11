/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

/* eslint-env jest */

import { shallow } from 'enzyme';
import React from 'react';

import {
  getGlobalAlertConfigByIdAndTimestamp,
  getLatestGlobalAlertConfig
} from 'in-alerting/smart-alerts/applications/api/globalApplicationAlertConfigs';
import {
  alertsTabDetailsFullyQualified,
  globalAlertDetails,
  alertsTabListFullyQualified,
  alertsList
} from 'in-applications/navigation/paths';
import {
  getAlertConfigByIdAndTimestamp,
  getLatestAlertConfig
} from 'in-alerting/smart-alerts/applications/api/applicationAlertConfig';
import AlertDetails from 'in-alerting/smart-alerts/applications/details/AlertDetails';

jest.mock('in-alerting/smart-alerts/applications/api/globalApplicationAlertConfigs');
jest.mock('in-alerting/smart-alerts/applications/api/applicationAlertConfig');

const asObservable = {
  asObservable: true
};

describe('Alert Details', () => {
  const defaultProps = {
    timeConfig: {
      windowSize: 12345678
    }
  };

  it('should render <GlobalAlertDetails> if matrix param "configsCategory" is set to local', () => {
    const location = {
      pathname: '/alerts/details',
      matrix: {
        '/alerts': {
          configsCategory: 'global'
        }
      }
    };

    const wrapper = shallow(<AlertDetails location={location} {...defaultProps} />);

    expect(wrapper.find('GlobalAlertDetails')).toHaveLength(1);
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

    const wrapper = shallow(<AlertDetails location={location} {...defaultProps} />);

    expect(wrapper.find('IndividiualAlertDetails')).toHaveLength(1);
  });

  it('should render <IndividiualAlertDetails> if matrix param "configsCategory" is absent', () => {
    const location = {
      pathname: '/alerts/details',
      matrix: {}
    };

    const wrapper = shallow(<AlertDetails location={location} {...defaultProps} />);

    expect(wrapper.find('IndividiualAlertDetails')).toHaveLength(1);
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

    const wrapper = shallow(<AlertDetails location={location} {...defaultProps} />).dive();
    const timestamp = Date.now();

    const actualGetConfig = wrapper.prop('getConfig');
    actualGetConfig('123', timestamp);

    expect(getGlobalAlertConfigByIdAndTimestamp).toHaveBeenCalledTimes(1);
    expect(getGlobalAlertConfigByIdAndTimestamp).toHaveBeenLastCalledWith('123', timestamp, asObservable);
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

    const wrapper = shallow(<AlertDetails location={location} {...defaultProps} />).dive();
    const actualGetConfig = wrapper.prop('getConfig');
    actualGetConfig('123');

    expect(getLatestGlobalAlertConfig).toHaveBeenCalledTimes(1);
    expect(getLatestGlobalAlertConfig).toHaveBeenLastCalledWith('123', asObservable);
  });

  it('prop getConfig should call getAlertConfigByIdAndTimestamp() for individual smart alert with created date', () => {
    const location = {
      pathname: '/alerts/details',
      matrix: {}
    };

    const wrapper = shallow(<AlertDetails location={location} {...defaultProps} />).dive();
    const actualGetConfig = wrapper.prop('getConfig');
    const timeConfig = Date.now();
    actualGetConfig('123', timeConfig);

    expect(getAlertConfigByIdAndTimestamp).toHaveBeenCalledTimes(1);
    expect(getAlertConfigByIdAndTimestamp).toHaveBeenLastCalledWith('123', timeConfig, asObservable);
  });

  it('prop getConfig should call getLatestAlertConfig() for individual smart alert', () => {
    const location = {
      pathname: '/alerts/details',
      matrix: {}
    };

    const wrapper = shallow(<AlertDetails location={location} {...defaultProps} />).dive();
    const actualGetConfig = wrapper.prop('getConfig');
    actualGetConfig('123');

    expect(getLatestAlertConfig).toHaveBeenCalledTimes(1);
    expect(getLatestAlertConfig).toHaveBeenLastCalledWith('123', asObservable);
  });

  it('should have the correct prop paths.detailsPath for per-ap-inventory-tab', () => {
    const location = {
      pathname: '/application/alerts/details',
      matrix: {}
    };

    const wrapper = shallow(<AlertDetails location={location} {...defaultProps} />).dive();

    const actualDetailsPath = wrapper.prop('paths').detailsPath;
    expect(actualDetailsPath).toBe(alertsTabDetailsFullyQualified);
  });

  it('should have correct prop paths.detailsPath for global-inventory-tab', () => {
    const location = {
      pathname: '/alerts/details',
      matrix: {}
    };

    const wrapper = shallow(<AlertDetails location={location} {...defaultProps} />).dive();

    const actualDetailsPath = wrapper.prop('paths').detailsPath;
    expect(actualDetailsPath).toBe(globalAlertDetails);
  });

  it('should have the correct prop paths.listPath for per-ap-inventory-tab', () => {
    const location = {
      pathname: '/application/alerts/details',
      matrix: {}
    };

    const wrapper = shallow(<AlertDetails location={location} {...defaultProps} />).dive();

    const actualListPath = wrapper.prop('paths').listPath;
    expect(actualListPath).toBe(alertsTabListFullyQualified);
  });

  it('should have the correct prop paths.listPath for global-inventory-tab', () => {
    const location = {
      pathname: '/alerts/details',
      matrix: {}
    };

    const wrapper = shallow(<AlertDetails location={location} {...defaultProps} />).dive();

    const actualListPath = wrapper.prop('paths').listPath;
    expect(actualListPath).toBe(alertsList);
  });
});
