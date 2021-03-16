/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

/* eslint-env mocha */

import { useLocation, Router } from 'react-router-dom';
import { mount } from 'enzyme';
import { expect } from 'chai';
import React from 'react';

import history from 'in-stores/navigation/history';
import useUrlState from 'in-hooks/useUrlState';

const LocationDisplay = () => {
  const urlStateDefinition = {
    bind: [
      {
        path: '/',
        name: 'param1',
        as: 'param1'
      },
      {
        path: '/',
        name: 'param2',
        as: 'param2'
      }
    ],
    resets: [
      {
        bind: [],
        reset: () => {
          return { param1: 'resetValue' };
        }
      }
    ]
  };
  const [{ param1 }, setUrlState] = useUrlState(urlStateDefinition);
  const location = useLocation();
  const updateUrlOnce = () => {
    setUrlState({ param1: 'abc' });
  };

  const updateUrlSimultaneously = () => {
    setUrlState({ param1: 'abc' });
    setUrlState({ param1: 'xyz' });
  };

  const updateMultipleMatrices = () => {
    setUrlState({ param1: 'xyz', param2: param1 });
  };

  return (
    <div data-testid="location-display">
      <p id="locationText">{location.matrix['/']?.param1}</p>
      <span id="metricCount">{Object.values(location.matrix['/'])?.length}</span>
      <button id="updateUrlOnce" onClick={updateUrlOnce}>
        Update URL
      </button>
      <button id="simultaneousUrlUpdate" onClick={updateUrlSimultaneously}>
        Update URL Simultaneously
      </button>
      <button id="multipleUpdate" onClick={updateMultipleMatrices}>
        Update Multiple
      </button>
    </div>
  );
};

describe('in-hooks/useUrlState', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(
      <Router history={history}>
        <LocationDisplay />
      </Router>
    );
  });
  it('must update the location on exposed setState call', async () => {
    wrapper.find('#updateUrlOnce').simulate('click');
    expect(wrapper.find('#locationText').text()).equal('abc');
  });

  it('must take the last value when simultaneously updating URL', async () => {
    wrapper.find('#simultaneousUrlUpdate').simulate('click');
    expect(wrapper.find('#locationText').text()).equal('xyz');
  });

  it('must update multple matrices at the same time', async () => {
    wrapper.find('#multipleUpdate').simulate('click');
    expect(wrapper.find('#metricCount').text()).equal('2');
  });
});
