/*eslint-env mocha*/

'use strict';

import Immutable from 'immutable';
import React from 'react/addons';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import {expect} from 'chai';
import * as ro from 'reactive-observables';

import enhanceMock from 'in-test/mocks/enhance';
import jsdom from 'in-test/jsdom';

const reemitSpec = {emitLatestOnSubscribe: true};
const TestUtils = React.addons.TestUtils;

describe('in-components.QueryBuilder', () => {

  jsdom();

  let filterSuggesterModule;
  let mapFiltersModule;

  // this is where the place in which the component will be rendered
  let node;

  // the React component under test
  let QueryBuilder;

  let suggestionObservable;

  beforeEach(() => {
    node = null;
    filterSuggesterModule = {
      getSuggestions: sinon.stub()
    };
    mapFiltersModule = {
      add: sinon.stub()
    };

    suggestionObservable = ro.create(reemitSpec);
    filterSuggesterModule.getSuggestions.returns(suggestionObservable);

    QueryBuilder = proxyquire('./QueryBuilder.es6', {
      '../hoc/enhance': enhanceMock,
      'in-services/stores/mapFilters': mapFiltersModule,
      'in-services/filterSuggester': filterSuggesterModule
    });
  });

  it('should render an empty QueryBuilder', () => {
    render({activeFilters: Immutable.List()});
    expect(getInput().value).to.equal('');
    expect(getSuggestions().length).to.equal(0);
    expect(getActiveFilters().length).to.equal(0);
  });

  it('should request suggestions upon input change', () => {
    const query = 'data';
    render({activeFilters: Immutable.List()});
    sendInputChange(query);
    expect(filterSuggesterModule.getSuggestions).to.have.callCount(1);
    expect(filterSuggesterModule.getSuggestions).to.have.been.calledWith(query);
  });

  function render(props) {
    const comp = TestUtils.renderIntoDocument(
      <QueryBuilder {...props} />
    );
    node = React.findDOMNode(comp);
  }

  function getInput() {
    return node.querySelector('input');
  }

  function sendInputChange(newValue) {
    TestUtils.Simulate.change(getInput(), {
      target: {value: newValue}
    });
  }

  function getSuggestions() {
    return node.querySelectorAll('.in-query-builder__suggestion-panel li');
  }

  function getActiveFilters() {
    return node.querySelectorAll('.in-query-builder__filter-badge');
  }
});
