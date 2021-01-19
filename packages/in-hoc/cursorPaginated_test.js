/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
/* eslint-env mocha */

import { create } from '@instana/observables';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { stub } from 'sinon';
import React from 'react';

import { getProps, NoopComponent } from 'in-test/enzymeTestUtils';
import cursorPaginated from 'in-hoc/cursorPaginated';

describe('in-hoc/cursorPaginated', () => {
  const resettingPropName = 'resetter';

  let get;
  let getResult;
  let getResettingProps;
  let Component;
  let wrapper;

  beforeEach(() => {
    get = stub();
    getResult = create();
    get.returns(getResult);
    getResettingProps = stub();
    getResettingProps.returns([resettingPropName]);
    Component = cursorPaginated({ getResettingProps, get })(NoopComponent);
  });

  it('must start loading immediately', () => {
    wrapper = shallow(<Component foo="bar" />);
    expect(getProps(wrapper)).to.deep.equal({
      canLoadMore: false,
      errors: [],
      foo: 'bar',
      items: [],
      progress: {
        loading: true
      },
      totalHits: null,
      totalRepresentedItemCount: null,
      next: null
    });
  });

  it('must set items that come in delayed', () => {
    wrapper = shallow(<Component foo="bar" />);
    const result = getSuccessfulResult();
    getResult.emit(result);
    wrapper.update();
    expect(getProps(wrapper)).to.deep.equal({
      adjustedWindowSize: undefined,
      canLoadMore: false,
      errors: [],
      time: undefined,
      foo: 'bar',
      items: result.data.items,
      progress: {
        loading: false
      },
      totalHits: result.data.totalHits,
      totalRepresentedItemCount: result.data.totalRepresentedItemCount,
      next: undefined
    });
  });

  it('must ignore successive incoming messages from the same observable', () => {
    wrapper = shallow(<Component foo="bar" />);
    const result = getSuccessfulResult();
    getResult.emit(result);
    wrapper.update();
    getResult.emit(result);
    expect(getProps(wrapper).items.length).to.equal(2);
  });

  it('must handle reloads', () => {
    wrapper = shallow(<Component foo="bar" />);
    const result = getSuccessfulResult();
    getResult.emit(result);
    wrapper.update();

    // simulate reload
    getResult = create();
    get.returns(getResult);
    getProps(wrapper, {
      omitFunctions: false
    }).reload();
    wrapper.update();
    expect(get.getCall(1).args[0].cursor).to.equal(null);
    expect(getProps(wrapper).items.length).to.equal(0);
    expect(getProps(wrapper).progress.loading).to.equal(true);
  });

  it('must support successive load more', () => {
    wrapper = shallow(<Component foo="bar" />);
    getResult.emit({
      progress: {
        loading: false
      },
      errors: [],
      data: {
        totalHits: 3,
        canLoadMore: true,
        items: [
          {
            id: 'a',
            cursor: 'a'
          },
          {
            id: 'b',
            cursor: 'b'
          }
        ]
      }
    });
    wrapper.update();

    // simulate load more
    getResult = create();
    getResult.emit({
      progress: {
        loading: false
      },
      errors: [],
      data: {
        totalHits: 3,
        canLoadMore: false,
        items: [
          {
            id: 'c',
            cursor: 'c'
          }
        ]
      }
    });
    get.returns(getResult);
    getProps(wrapper, {
      omitFunctions: false
    }).loadMore();
    wrapper.update();
    expect(get.getCall(1).args[0].cursor).to.equal('b');
    expect(getProps(wrapper).items).to.deep.equal([
      {
        id: 'a',
        cursor: 'a'
      },
      {
        id: 'b',
        cursor: 'b'
      },
      {
        id: 'c',
        cursor: 'c'
      }
    ]);
    expect(getProps(wrapper).progress.loading).to.equal(false);
    expect(getProps(wrapper).canLoadMore).to.equal(false);
  });

  it('must automatically reload once one of the resetting props changes', () => {
    wrapper = shallow(<Component foo="bar" />);
    getResult.emit(getSuccessfulResult());
    wrapper.update();

    // simulate resetting prop change
    getResult = create();
    getResult.emit({
      progress: {
        loading: false
      },
      errors: ['Something broke miserably'],
      data: null
    });
    get.returns(getResult);
    wrapper.setProps({ [resettingPropName]: 42 });
    wrapper.update();
    expect(get.callCount).to.equal(2);
    expect(getProps(wrapper)).to.deep.equal({
      adjustedWindowSize: undefined,
      canLoadMore: false,
      errors: ['Something broke miserably'],
      foo: 'bar',
      [resettingPropName]: 42,
      items: [],
      progress: {
        loading: false
      },
      time: undefined,
      totalHits: null,
      totalRepresentedItemCount: null,
      next: null
    });
  });
});

function getSuccessfulResult() {
  return {
    progress: {
      loading: false
    },
    errors: [],
    data: {
      totalHits: 2,
      totalRepresentedItemCount: 20,
      canLoadMore: false,
      items: [
        {
          id: 'a',
          cursor: 'a'
        },
        {
          id: 'b',
          cursor: 'b'
        }
      ]
    }
  };
}
