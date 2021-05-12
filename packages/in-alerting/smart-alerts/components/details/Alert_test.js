/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

/* eslint-env mocha */

import proxyquire from 'proxyquire';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import React from 'react';
import Sinon from 'sinon';

const triggerReload = Sinon.fake();

const Alert = proxyquire('in-alerting/smart-alerts/components/details/Alert', {
  '@instana/hooks': {
    useObservable: params => {
      return params();
    }
  },
  react: {
    React,
    useState: () => [null, triggerReload]
  },
  'in-stores/navigation/navigation': {
    mutateUrl: Sinon.fake()
  }
}).default;

describe('Alert', () => {
  beforeEach(() => {
    triggerReload.resetHistory();
  });

  it('setRevision should trigger a reload if created date is abscent', () => {
    const wrapper = shallow(
      <Alert
        paths={{
          detailsPath: '',
          listPath: '',
          alertsTabSegment: ''
        }}
        matrix={{
          alertIdParam: '',
          alertCreatedParam: ''
        }}
        location={{
          pathname: '',
          matrix: {}
        }}
        getConfig={() => ({ data: {}, errors: [] })}
        getConfigVersions={() => ({ data: [], errors: [] })}
        renderAlertConfiguration={Sinon.fake()}
        deleteConfig={Sinon.fake()}
        disableConfig={Sinon.fake()}
        enableConfig={Sinon.fake()}
        renderSmartAlertDialog={Sinon.fake()}
        restoreConfig={Sinon.fake()}
        timeConfig={{
          windowSize: 12345678
        }}
      />
    );

    const actualSetRevision = wrapper.find('AlertHeader').prop('setRevision');

    actualSetRevision();

    expect(triggerReload.callCount).to.be.equal(1);
  });

  it('setRevision should not trigger a reload if created date is present', () => {
    const wrapper = shallow(
      <Alert
        paths={{
          detailsPath: '',
          listPath: '',
          alertsTabSegment: ''
        }}
        matrix={{
          alertIdParam: '',
          alertCreatedParam: ''
        }}
        location={{
          pathname: '',
          matrix: {}
        }}
        getConfig={() => ({ data: {}, errors: [] })}
        getConfigVersions={() => ({ data: [], errors: [] })}
        renderAlertConfiguration={() => {}}
        deleteConfig={Sinon.fake()}
        disableConfig={Sinon.fake()}
        enableConfig={Sinon.fake()}
        renderSmartAlertDialog={Sinon.fake()}
        restoreConfig={Sinon.fake()}
        timeConfig={{
          windowSize: 12345678
        }}
      />
    );

    const actualSetRevision = wrapper.find('AlertHeader').prop('setRevision');

    actualSetRevision(Date.now());

    expect(triggerReload.callCount).to.be.equal(0);
  });
});
