/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env mocha */

import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import React from 'react';

import { analyzeTagFilters as tagFiltersTrackers } from 'in-websites/tracker';
import { tagFilterManipulators } from 'in-websites/tagFiltersHoc';
import { NoopComponent } from 'in-test/enzymeTestUtils';

describe('in-websites/tagFiltersHoc', () => {
  let Component;
  let wrapper;

  beforeEach(() => {
    Component = tagFilterManipulators({ tagFiltersTrackers })(NoopComponent);
  });

  it('renders the NoopComponent as the root element', function() {
    wrapper = shallow(<Component />);
    expect(wrapper.find(NoopComponent)).to.have.lengthOf(1);
  });

  describe('removeTagFilter', () => {
    const tagFilters = [
      {
        name: 'beacon.browser.name',
        operator: 'EQUALS',
        stringValue: 'Chrome'
      },
      {
        name: 'beacon.type',
        operator: 'EQUALS',
        stringValue: 'pageLoad'
      }
    ];
    let setTagFilters;
    let removeTagFilter;

    beforeEach(() => {
      setTagFilters = sinon.stub();
      wrapper = shallow(<Component tagFilters={tagFilters} setTagFilters={setTagFilters} />);
      removeTagFilter = wrapper.prop('removeTagFilter');
    });

    it('expects removeTagFitler to be called once', function() {
      removeTagFilter('beacon.browser.name', 'EQUALS');
      expect(setTagFilters).to.have.callCount(1);
    });

    it('expects removeTagFilter to remove one tagFilter', function() {
      removeTagFilter('beacon.browser.name', 'EQUALS');
      const filteredTags = setTagFilters.getCall(0).args[0];
      expect(filteredTags).to.have.length(1);
    });

    it('expects tagFilter to be removed with name argument', function() {
      removeTagFilter('beacon.browser.name');
      const filteredTags = setTagFilters.getCall(0).args[0];
      expect(filteredTags).to.deep.equal([
        {
          name: 'beacon.type',
          operator: 'EQUALS',
          stringValue: 'pageLoad'
        }
      ]);
    });

    it('expects tagFilter to be removed with both arguments', function() {
      removeTagFilter('beacon.browser.name', 'EQUALS');
      const filteredTags = setTagFilters.getCall(0).args[0];
      expect(filteredTags).to.deep.equal([
        {
          name: 'beacon.type',
          operator: 'EQUALS',
          stringValue: 'pageLoad'
        }
      ]);
    });
  });

  describe('addTagFilter', () => {
    const tagFilters = [
      {
        name: 'beacon.browser.name',
        operator: 'EQUALS',
        stringValue: 'Chrome'
      },
      {
        name: 'beacon.type',
        operator: 'EQUALS',
        stringValue: 'pageLoad'
      }
    ];
    let setTagFilters;
    let addTagFilter;

    beforeEach(() => {
      setTagFilters = sinon.stub();
      wrapper = shallow(<Component tagFilters={tagFilters} setTagFilters={setTagFilters} />);
      addTagFilter = wrapper.prop('addTagFilter');
    });

    it('expects addTagFilter to be called once', function() {
      addTagFilter({ name: 'beacon.browser.name', operator: 'EQUALS', stringValue: 'Firefox' });
      expect(setTagFilters).to.have.callCount(1);
    });

    it('expects addTagFilter to add one tagFilter', function() {
      addTagFilter({ name: 'beacon.browser.name', operator: 'EQUALS', stringValue: 'Firefox' });
      const filteredTags = setTagFilters.getCall(0).args[0];
      expect(filteredTags).to.have.length(3);
    });

    it('expects addTagFilter to add specified filter', function() {
      addTagFilter({ name: 'beacon.browser.name', operator: 'EQUALS', stringValue: 'Firefox' });
      const filteredTags = setTagFilters.getCall(0).args[0];
      expect(filteredTags).to.deep.equal([
        {
          name: 'beacon.browser.name',
          operator: 'EQUALS',
          stringValue: 'Chrome'
        },
        {
          name: 'beacon.type',
          operator: 'EQUALS',
          stringValue: 'pageLoad'
        },
        {
          name: 'beacon.browser.name',
          operator: 'EQUALS',
          stringValue: 'Firefox'
        }
      ]);
    });
  });

  describe('upsertTagFilter', () => {
    const tagFilters = [
      {
        name: 'beacon.browser.name',
        operator: 'EQUALS',
        stringValue: 'Chrome'
      },
      {
        name: 'beacon.type',
        operator: 'EQUALS',
        stringValue: 'pageLoad'
      }
    ];
    let setTagFilters;
    let upsertTagFilter;

    beforeEach(() => {
      setTagFilters = sinon.stub();
      wrapper = shallow(<Component tagFilters={tagFilters} setTagFilters={setTagFilters} />);
      upsertTagFilter = wrapper.prop('upsertTagFilter');
    });

    it('expects upsertTagFilter to be called once', function() {
      upsertTagFilter({ name: 'beacon.browser.name', operator: 'EQUALS', stringValue: 'Firefox' });
      expect(setTagFilters).to.have.callCount(1);
    });

    it('expects upsertTagFilter to upsert existing tagFilter', function() {
      upsertTagFilter({ name: 'beacon.browser.name', operator: 'EQUALS', stringValue: 'Firefox' });
      const filteredTags = setTagFilters.getCall(0).args[0];
      expect(filteredTags).to.deep.equal([
        {
          name: 'beacon.type',
          operator: 'EQUALS',
          stringValue: 'pageLoad'
        },
        {
          name: 'beacon.browser.name',
          operator: 'EQUALS',
          stringValue: 'Firefox'
        }
      ]);
    });
  });

  describe('clearTagFilters', () => {
    const tagFilters = [
      {
        name: 'beacon.browser.name',
        operator: 'EQUALS',
        stringValue: 'Chrome'
      },
      {
        name: 'beacon.type',
        operator: 'EQUALS',
        stringValue: 'pageLoad'
      }
    ];
    let setTagFilters;
    let clearTagFilters;

    beforeEach(() => {
      setTagFilters = sinon.stub();
      wrapper = shallow(<Component tagFilters={tagFilters} setTagFilters={setTagFilters} />);
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
