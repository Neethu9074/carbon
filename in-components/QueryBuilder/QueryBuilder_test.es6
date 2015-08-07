/*eslint-env mocha*/

'use strict';

import Immutable from 'immutable';
import React from 'react/addons';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import {expect} from 'chai';

import enhanceMock from 'in-test/mocks/enhance';
import jsdom from 'in-test/jsdom';

const TestUtils = React.addons.TestUtils;

describe('in-components.QueryBuilder', () => {

  jsdom();

  let filterSuggesterModule;
  let mapFiltersModule;

  // this is where the place in which the component will be rendered
  let node;
  let QueryBuilder;

  beforeEach(() => {
    node = null;
    filterSuggesterModule = {
      getSuggestions: sinon.stub()
    };
    mapFiltersModule = {
      add: sinon.stub()
    };

    QueryBuilder = proxyquire('./QueryBuilder.es6', {
      '../hoc/enhance': enhanceMock,
      'in-services/stores/mapFilters': mapFiltersModule,
      'in-services/filterSuggester': filterSuggesterModule
    });
  });

  it('should render an empty QueryBuilder', () => {
    render({activeFilters: Immutable.List()});
    expect(getInput().value).to.equal('');
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
});
