// /* eslint-env mocha */

import proxyquire from 'proxyquire';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import React from 'react';

import { NoopComponent } from 'in-test/enzymeTestUtils';

describe('in-analyze/tagFiltersHoc', () => {
  let getTagFilterManipulators;
  let Component;
  let wrapper;

  beforeEach(() => {
    getTagFilterManipulators = proxyquire('in-analyze/tagFiltersHoc', {
      'in-analyze/AnalyzeView/components/AnalyzeEditTagFilterDialog': { '@noCallThru': true }
    }).getTagFilterManipulators;
    // eslint-disable-next-line react/display-name
    Component = props => <NoopComponent {...props} {...getTagFilterManipulators(props)} />;
  });

  it('renders the NoopComponent as the root element', function() {
    wrapper = shallow(<Component filters={{ tagFilter: [] }} />);
    expect(wrapper.find(NoopComponent)).to.have.lengthOf(1);
  });

  describe('removeTagFilter', () => {
    const tagFilters = [
      {
        name: 'call.latency',
        secondLevelName: false,
        value: '100',
        operator: 'LESS_THAN'
      },
      {
        name: 'call.latency',
        secondLevelName: false,
        value: '50',
        operator: 'GREATER_THAN'
      }
    ];
    let setTagFilters;
    let removeTagFilter;

    beforeEach(() => {
      setTagFilters = sinon.stub();
      wrapper = shallow(<Component filters={{ tagFilter: tagFilters }} setTagFilters={setTagFilters} />);
      removeTagFilter = wrapper.prop('removeTagFilter');
    });

    it('expects removeTagFilter to be called once', function() {
      removeTagFilter('');
      expect(setTagFilters).to.have.callCount(1);
    });

    it('expects removeTagFilter to remove one tagFilter', function() {
      removeTagFilter('call.latency', 'LESS_THAN', false, '100');
      const filteredTags = setTagFilters.getCall(0).args[0];
      expect(filteredTags).to.have.length(1);
    });

    it('expects removeTagFilter to remove specified tagFilter of tagfilters with same name', function() {
      removeTagFilter('call.latency', null, null, '100');
      const filteredTags = setTagFilters.getCall(0).args[0];
      expect(filteredTags).to.deep.equal([
        {
          name: 'call.latency',
          secondLevelName: false,
          value: '50',
          operator: 'GREATER_THAN'
        }
      ]);
    });

    it('expects removeTagFilter to remove specified tagFilter of tagfilters with same name', function() {
      removeTagFilter('call.latency', 'LESS_THAN', null, null);
      const filteredTags = setTagFilters.getCall(0).args[0];
      expect(filteredTags).to.deep.equal([
        {
          name: 'call.latency',
          secondLevelName: false,
          value: '50',
          operator: 'GREATER_THAN'
        }
      ]);
    });
  });

  describe('addTagFilter', () => {
    const tagFilters = [
      {
        name: 'call.latency',
        secondLevelName: false,
        value: '100',
        operator: 'LESS_THAN'
      },
      {
        name: 'call.latency',
        secondLevelName: false,
        value: '50',
        operator: 'GREATER_THAN'
      }
    ];
    let setTagFilters;
    let addTagFilter;

    beforeEach(() => {
      setTagFilters = sinon.stub();
      wrapper = shallow(<Component filters={{ tagFilter: tagFilters }} setTagFilters={setTagFilters} />);
      addTagFilter = wrapper.prop('addTagFilter');
    });

    it('expects addTagFilter to be called once', function() {
      addTagFilter({ name: 'call.name', operator: 'EQUALS', secondLevelName: false, value: 'find' });
      expect(setTagFilters).to.have.callCount(1);
    });

    it('expects addTagFilter to add one tagFilter', function() {
      addTagFilter({ name: 'call.name', operator: 'EQUALS', secondLevelName: false, value: 'find' });
      const filteredTags = setTagFilters.getCall(0).args[0];
      expect(filteredTags).to.have.length(3);
    });

    it('expects addTagFilter to add specified filter', function() {
      addTagFilter({ name: 'call.name', operator: 'EQUALS', secondLevelName: false, value: 'find' });
      const filteredTags = setTagFilters.getCall(0).args[0];
      expect(filteredTags).to.deep.equal([
        {
          name: 'call.latency',
          secondLevelName: false,
          value: '100',
          operator: 'LESS_THAN'
        },
        {
          name: 'call.latency',
          secondLevelName: false,
          value: '50',
          operator: 'GREATER_THAN'
        },
        {
          entity: 'NOT_APPLICABLE',
          name: 'call.name',
          operator: 'EQUALS',
          secondLevelName: false,
          value: 'find'
        }
      ]);
    });
  });

  describe('upsertTagFilter', () => {
    const tagFilters = [
      {
        name: 'call.latency',
        secondLevelName: false,
        value: '100',
        operator: 'LESS_THAN'
      },
      {
        entity: 'NOT_APPLICABLE',
        name: 'call.latency',
        secondLevelName: false,
        value: '50',
        operator: 'GREATER_THAN'
      }
    ];
    let setTagFilters;
    let upsertTagFilter;

    beforeEach(() => {
      setTagFilters = sinon.stub();
      wrapper = shallow(<Component filters={{ tagFilter: tagFilters }} setTagFilters={setTagFilters} />);
      upsertTagFilter = wrapper.prop('upsertTagFilter');
    });

    it('expects upsertTagFilter to be called once', function() {
      upsertTagFilter({});
      expect(setTagFilters).to.have.callCount(1);
    });

    it('expects upsertTagFilter to upsert existing tagFilter', function() {
      upsertTagFilter({ name: 'call.latency', secondLevelName: false, operator: 'LESS_THAN', value: '70' });
      const filteredTags = setTagFilters.getCall(0).args[0];
      expect(filteredTags).to.deep.equal([
        {
          entity: 'NOT_APPLICABLE',
          name: 'call.latency',
          secondLevelName: false,
          value: '50',
          operator: 'GREATER_THAN'
        },
        {
          entity: 'NOT_APPLICABLE',
          name: 'call.latency',
          secondLevelName: false,
          value: '70',
          operator: 'LESS_THAN'
        }
      ]);
    });
  });

  describe('clearTagFilters', () => {
    const tagFilters = [
      {
        name: 'call.latency',
        secondLevelName: false,
        value: '100',
        operator: 'LESS_THAN'
      },
      {
        name: 'call.latency',
        secondLevelName: false,
        value: '50',
        operator: 'GREATER_THAN'
      }
    ];
    let setTagFilters;
    let clearTagFilters;

    beforeEach(() => {
      setTagFilters = sinon.stub();
      wrapper = shallow(<Component filters={{ tagFilter: tagFilters }} setTagFilters={setTagFilters} />);
      clearTagFilters = wrapper.prop('clearTagFilters');
    });

    it('expects clearTagFilters to be called once', function() {
      clearTagFilters();
      expect(setTagFilters).to.have.callCount(1);
    });

    it('expects clearTagFilters to remove all filters', function() {
      clearTagFilters();
      const filteredTags = setTagFilters.getCall(0).args[0];
      expect(filteredTags).to.deep.equal([]);
    });
  });
});
