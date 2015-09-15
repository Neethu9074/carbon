/*eslint-env mocha*/
import Immutable from 'immutable';
import React from 'react/addons';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import {expect} from 'chai';
import * as ro from 'reactive-observables';

import {createTagFilter} from 'in-services/filtering';
import enhanceMock from 'in-test/mocks/enhance';
import jsdom from 'in-test/jsdom';

const reemitSpec = {emitLatestOnSubscribe: true};
const TestUtils = React.addons.TestUtils;

const tagFilterSuggestions = Immutable.fromJS([
  createTagFilter('Database'),
  createTagFilter('Datastore'),
  createTagFilter('Cassandra')
]);

describe('in-components.QueryBuilder', () => {

  jsdom();

  let filterSuggesterModule;
  let filtersModule;

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
    filtersModule = {
      addFilter: sinon.stub(),
      removeFilter: sinon.stub()
    };

    suggestionObservable = ro.create(reemitSpec);
    filterSuggesterModule.getSuggestions.returns(suggestionObservable);

    QueryBuilder = proxyquire('./QueryBuilder.es6', {
      '../hoc/enhance': enhanceMock,
      'in-services/stores/filters': filtersModule,
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

  it('should render suggestions', () => {
    const query = 'data';
    render({activeFilters: Immutable.List()});
    sendInputChange(query);

    suggestionObservable.emit(tagFilterSuggestions);
    const suggestions = getSuggestions();
    expect(suggestions.length).to.equal(tagFilterSuggestions.size);
    expect(suggestions[0].textContent).to.contain('Database');
    expect(suggestions[1].textContent).to.contain('Datastore');
    expect(suggestions[2].textContent).to.contain('Cassandra');
  });

  it('should render active filters', () => {
    render({activeFilters: tagFilterSuggestions});
    const activeFilters = getActiveFilters();
    expect(activeFilters.length).to.equal(tagFilterSuggestions.size);
    expect(activeFilters[0].textContent).to.contain('Database');
    expect(activeFilters[1].textContent).to.contain('Datastore');
    expect(activeFilters[2].textContent).to.contain('Cassandra');
  });

  it('should remove active filters when filter badge is clicked', () => {
    render({activeFilters: tagFilterSuggestions});
    const removeButton = getActiveFilters()[1].querySelector('[class$=remove]');
    TestUtils.Simulate.click(removeButton);
    expect(filtersModule.removeFilter).to.have.callCount(1);
  });

  it('should add filter when clicking on suggestion', () => {
    render({activeFilters: Immutable.List()});
    const query = 'data';
    sendInputChange(query);
    suggestionObservable.emit(tagFilterSuggestions);

    TestUtils.Simulate.click(getSuggestions()[1]);

    expect(filtersModule.addFilter).to.have.callCount(1);
    expect(filtersModule.addFilter)
      .to.have.been.calledWith(tagFilterSuggestions.get(1));
  });

  it('should add first suggestion when hitting enter', () => {
    render({activeFilters: Immutable.List()});
    const query = 'data';
    sendInputChange(query);
    suggestionObservable.emit(tagFilterSuggestions);

    sendEnterKeyCode();

    expect(filtersModule.addFilter).to.have.callCount(1);
    expect(filtersModule.addFilter)
      .to.have.been.calledWith(tagFilterSuggestions.get(0));
  });

  it('should allow navigation in suggestions via arrow keys', () => {
    render({activeFilters: Immutable.List()});
    const query = 'data';
    sendInputChange(query);
    suggestionObservable.emit(tagFilterSuggestions);

    const suggestions = getSuggestions();
    sendDownKeyCode();
    expect(isActive(suggestions[0])).to.equal(true);
    expect(isActive(suggestions[1])).to.equal(false);
    expect(isActive(suggestions[2])).to.equal(false);

    sendDownKeyCode();
    expect(isActive(suggestions[0])).to.equal(false);
    expect(isActive(suggestions[1])).to.equal(true);
    expect(isActive(suggestions[2])).to.equal(false);

    sendDownKeyCode();
    expect(isActive(suggestions[0])).to.equal(false);
    expect(isActive(suggestions[1])).to.equal(false);
    expect(isActive(suggestions[2])).to.equal(true);

    sendDownKeyCode();
    expect(isActive(suggestions[0])).to.equal(false);
    expect(isActive(suggestions[1])).to.equal(false);
    expect(isActive(suggestions[2])).to.equal(true);

    sendUpKeyCode();
    expect(isActive(suggestions[0])).to.equal(false);
    expect(isActive(suggestions[1])).to.equal(true);
    expect(isActive(suggestions[2])).to.equal(false);

    sendUpKeyCode();
    expect(isActive(suggestions[0])).to.equal(true);
    expect(isActive(suggestions[1])).to.equal(false);
    expect(isActive(suggestions[2])).to.equal(false);

    sendUpKeyCode();
    expect(isActive(suggestions[0])).to.equal(true);
    expect(isActive(suggestions[1])).to.equal(false);
    expect(isActive(suggestions[2])).to.equal(false);

    function isActive(suggestion) {
      return suggestion.className.indexOf('active') !== -1;
    }
  });

  it('should choose selected suggestion upon hitting enter', () => {
    render({activeFilters: Immutable.List()});
    const query = 'data';
    sendInputChange(query);
    suggestionObservable.emit(tagFilterSuggestions);

    sendDownKeyCode(); // 0
    sendDownKeyCode(); // 1
    sendDownKeyCode(); // 2
    sendEnterKeyCode();

    expect(filtersModule.addFilter).to.have.callCount(1);
    expect(filtersModule.addFilter)
      .to.have.been.calledWith(tagFilterSuggestions.get(2));
  });

  it('should clear the input field on escape', () => {
    render({activeFilters: Immutable.List()});
    const query = 'data';
    sendInputChange(query);
    suggestionObservable.emit(tagFilterSuggestions);

    sendEscapeKeyCode();

    expect(getInput().value).to.equal('');
    expect(getSuggestions().length).to.equal(0);
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

  function sendEnterKeyCode() {
    sendKeyCode(13);
  }

  function sendEscapeKeyCode() {
    sendKeyCode(27);
  }

  function sendUpKeyCode() {
    sendKeyCode(38);
  }

  function sendDownKeyCode() {
    sendKeyCode(40);
  }

  function sendKeyCode(keyCode) {
    TestUtils.Simulate.keyUp(getInput(), {keyCode});
  }

  function getSuggestions() {
    return node.querySelectorAll('.in-query-builder__suggestion-panel li');
  }

  function getActiveFilters() {
    return node.querySelectorAll('.in-query-builder__filter-badge');
  }
});
