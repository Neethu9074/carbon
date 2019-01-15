/* eslint-env mocha, node */

import { create } from 'reactive-observables';
import proxyquire from 'proxyquire';
import { cloneDeep } from 'lodash';
import { mount } from 'enzyme';
import { expect } from 'chai';
import { stub } from 'sinon';
import React from 'react';

import { intParser } from 'in-stores/navigation/urlParameterUtils';
import { getProps, NoopComponent } from 'in-test/enzymeTestUtils';

describe('in-hoc/withUrlState', () => {
  let originalRequestAnimationFrame;
  let mutateUrl;
  let getModifiedUrlStream;
  let navigationParameters$;
  let addReset;
  let removeReset;
  let history;

  let withUrlState;
  let Component;
  let wrapper;

  beforeEach(() => {
    // make tests completely synchronous
    originalRequestAnimationFrame = global.requestAnimationFrame;
    global.requestAnimationFrame = fn => fn();

    Component = null;
    wrapper = null;

    getModifiedUrlStream = stub();
    history = {};
    navigationParameters$ = create();
    navigationParameters$.subscribe(location => (history.location = location));
    mutateUrl = stub();
    const localMutateUrl = function localMutateUrl(mutator) {
      mutateUrl();
      const newLocation = cloneDeep(history.location);
      mutator(newLocation);
      navigationParameters$.emit(newLocation);
    };
    addReset = stub();
    removeReset = stub();

    withUrlState = proxyquire('./withUrlState', {
      'in-stores/navigation': {
        mutateUrl: localMutateUrl,
        navigationParameters$,
        getModifiedUrlStream
      },
      'in-stores/navigation/urlParameterResets': {
        addReset,
        removeReset
      },
      'in-stores/navigation/history': {
        default: history
      }
    }).default;
  });

  afterEach(() => {
    global.requestAnimationFrame = originalRequestAnimationFrame;
  });

  describe('initial state based on URL', () => {
    it('must use value received from URL', () => {
      setInitialLocation({
        path: '/things',
        query: {
          time: '123'
        },
        matrix: {
          '/things': {
            'things.page': '42'
          }
        }
      });

      Component = withUrlState({
        bind: [
          {
            name: 'time',
            parser: intParser
          },
          {
            path: '/things',
            name: 'things.page',
            as: 'page',
            parser: intParser,
            initialState: 1
          }
        ],

        reducerName: 'onChange'
      })(NoopComponent);

      wrapper = mount(<Component foo="bar" />);
      expect(getProps(wrapper)).to.deep.equal({
        foo: 'bar',
        time: 123,
        page: 42
      });
    });

    it('must use initial values when not defined in URL', () => {
      setInitialLocation({
        path: '/things',
        query: {},
        matrix: {}
      });

      Component = withUrlState({
        bind: [
          {
            name: 'time',
            parser: intParser,
            initialState: 0
          },
          {
            path: '/things',
            name: 'thing.page',
            as: 'page',
            parser: intParser,
            initialState: 1
          }
        ],

        reducerName: 'onChange'
      })(NoopComponent);

      wrapper = mount(<Component foo="bar" />);
      expect(getProps(wrapper)).to.deep.equal({
        foo: 'bar',
        time: 0,
        page: 1
      });
    });
  });

  describe('responding to changes', () => {
    it('must apply the reducer by changing the URL', () => {
      setInitialLocation({
        path: '/things',
        query: {
          time: '123'
        },
        matrix: {
          '/things': {
            'things.page': '2'
          }
        }
      });

      Component = withUrlState({
        bind: [
          {
            name: 'time',
            parser: intParser
          },
          {
            path: '/things',
            name: 'things.page',
            as: 'page',
            parser: intParser,
            initialState: 1
          }
        ],

        reducerName: 'onChange'
      })(NoopComponent);

      wrapper = mount(<Component foo="bar" />);

      getProps(wrapper, { omitFunctions: false }).onChange({
        page: 3,
        time: 124
      });
      wrapper.update();
      expect(mutateUrl).to.have.callCount(1);
      expect(getProps(wrapper)).to.deep.equal({
        foo: 'bar',
        time: 124,
        page: 3
      });
      expect(history.location).to.deep.equal({
        path: '/things',
        query: {
          time: '124'
        },
        matrix: {
          '/things': {
            'things.page': '3'
          }
        }
      });
    });
  });

  it('must register resets', () => {
    setInitialLocation({
      path: '/things',
      query: {
        time: '123',
        snapshotId: 'abc'
      },
      matrix: {
        '/things': {
          'things.page': '2'
        }
      }
    });

    Component = withUrlState({
      bind: [
        {
          name: 'time',
          parser: intParser
        },
        {
          path: '/things',
          name: 'things.page',
          as: 'page',
          parser: intParser,
          initialState: 1
        }
      ],

      resets: [
        {
          bind: [
            {
              name: 'snapshotId'
            }
          ],
          reset: {
            page: null
          }
        }
      ],

      reducerName: 'onChange'
    })(NoopComponent);

    wrapper = mount(<Component foo="bar" />);

    expect(addReset).to.have.callCount(1);

    const nextLocation = {
      path: '/things',
      query: {
        time: '123',
        snapshotId: 'def'
      },
      matrix: {
        '/things': {
          'things.page': '2'
        }
      }
    };
    addReset.getCall(0).args[0](history.location, nextLocation);
    expect(nextLocation).to.deep.equal({
      path: '/things',
      query: {
        time: '123',
        snapshotId: 'def'
      },
      matrix: {
        '/things': {}
      }
    });
  });

  function setInitialLocation(location) {
    history.location = location;
    navigationParameters$.emit(location);
  }
});
