/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

/* eslint-env jest */

import { shallow } from 'enzyme';
import React from 'react';
import Alert from 'in-alerting/smart-alerts/components/details/Alert';

const mockTriggerReload = jest.fn();

jest.mock('@instana/hooks', () => ({
  useObservable: params => {
    return params();
  }
}));
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: () => [null, mockTriggerReload]
}));
jest.mock('in-stores/navigation/navigation', () => ({
  ...jest.requireActual('in-stores/navigation/navigation'),
  mutateUrl: jest.fn()
}));

describe('Alert', () => {
  beforeEach(() => {
    mockTriggerReload.mockClear();
  });

  const defaultProps = {
    paths: {
      detailsPath: '',
      listPath: '',
      alertsTabSegment: ''
    },
    matrix: {
      alertIdParam: '',
      alertCreatedParam: ''
    },
    location: {
      pathname: '',
      matrix: {}
    },
    getConfig: () => ({ data: {}, errors: [] }),
    getConfigVersions: () => ({ data: [], errors: [] }),
    renderAlertConfiguration: jest.fn(),
    deleteConfig: jest.fn(),
    disableConfig: jest.fn(),
    enableConfig: jest.fn(),
    renderSmartAlertDialog: jest.fn(),
    restoreConfig: jest.fn(),
    timeConfig: {
      windowSize: 12345678
    }
  };

  it('setRevision should trigger a reload if created date is absent', () => {
    const wrapper = shallow(<Alert {...defaultProps} />);

    const actualSetRevision = wrapper.find('AlertHeader').prop('setRevision');

    actualSetRevision();

    expect(mockTriggerReload).toHaveBeenCalledTimes(1);
  });

  it('setRevision should not trigger a reload if created date is present', () => {
    const wrapper = shallow(<Alert {...defaultProps} />);

    const actualSetRevision = wrapper.find('AlertHeader').prop('setRevision');

    actualSetRevision(Date.now());

    expect(mockTriggerReload).toHaveBeenCalledTimes(0);
  });
});
