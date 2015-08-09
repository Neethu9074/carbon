/*eslint-env mocha*/



import Immutable from 'immutable';
import React from 'react/addons';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import {expect} from 'chai';

import jsdom from 'in-test/jsdom';

const TestUtils = React.addons.TestUtils;

describe('in-components.FilterBadge', () => {

  const filter = Immutable.Map({
    type: 'tag',
    label: 'MongoDB',
    icon: 'timeline',
    predicate: () => {}
  });


  jsdom();

  let onRemove;
  let FilterBadge;

  beforeEach(() => {
    onRemove = sinon.stub();

    FilterBadge = proxyquire('./FilterBadge.es6', {});
  });

  it('should hold a React component', () => {
    expect(FilterBadge).to.be.an.instanceOf(Function);
  });

  it('should render a filter specific icon', () => {
    const node = render({filter});
    const icon = node.querySelector('.icon.icon-timeline');
    expect(icon != null).to.equal(true);
  });

  it('should render the filter text', () => {
    const node = render({filter});
    expect(node.textContent.indexOf(filter.get('label')) !== -1).to.equal(true);
  });

  it('should remove the filter upon remove click', () => {
    const removeButton = render({filter}).querySelector('[class$=remove]');
    TestUtils.Simulate.click(removeButton);
    expect(onRemove).to.have.callCount(1);
  });

  function render(props) {
    props.onRemove = onRemove;
    const comp = TestUtils.renderIntoDocument(
      <FilterBadge {...props} />
    );
    return React.findDOMNode(comp);
  }
});
