/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
/* eslint-env mocha */

import { expect } from 'chai';

import { createTagForm, changeName, changeOperator } from 'in-new-components/QueryBuilder/validation/tagForm';
import { EQUALS, IS_BLANK, CONTAINS, GREATER_THAN } from 'in-new-components/QueryBuilder/tagFilter/operators';
import { STRING, NUMBER, BOOLEAN, KEY_VALUE_PAIR } from 'in-new-components/QueryBuilder/tagFilter/types';
import { DESTINATION } from 'in-new-components/QueryBuilder/tagFilter/entities';
import { deepFreeze } from 'in-services/util/object';

const tagCatalog = deepFreeze({
  tags: [
    {
      name: 'name',
      type: STRING,
      canApplyToSource: true,
      canApplyToDestination: true
    },
    {
      name: 'application',
      type: STRING
    },
    {
      name: 'latency',
      type: NUMBER
    },
    {
      name: 'erroneous',
      type: BOOLEAN
    },
    {
      name: 'meta',
      type: KEY_VALUE_PAIR
    }
  ]
});

describe('in-new-components/QueryBuilder/validation/tagForm', () => {
  it('must create a tag form for simple string tags', () => {
    const form = createTagForm(tagCatalog, {
      name: 'name',
      value: 'shop',
      operator: EQUALS,
      entity: DESTINATION
    });

    expect(form.hierarchyValid).to.equal(true);
    expect(form.get('entity').value).to.equal(DESTINATION);
  });

  it('must create a tag form for incomplete configurations', () => {
    const form = createTagForm(tagCatalog, {
      name: 'latency'
    });

    expect(form.get('name').value).to.equal('latency');
    expect(form.get('operator').value).to.equal(EQUALS);
    expect(form.get('value').value).to.equal(undefined);
    expect(form.get('key')).to.equal(undefined);
    expect(form.get('entity')).to.equal(undefined);
    expect(form.hierarchyValid).to.equal(false);
  });

  it('must update the form when the operator changes in such a way that a value is now required', () => {
    const form = createTagForm(tagCatalog, {
      name: 'meta',
      operator: IS_BLANK,
      key: 'user-agent'
    });
    expect(form.hierarchyValid).to.equal(true);
    expect(form.get('name').value).to.equal('meta');
    expect(form.get('operator').value).to.equal(IS_BLANK);
    expect(form.get('value')).to.equal(undefined);
    expect(form.get('key').value).to.equal('user-agent');

    const changedForm = changeOperator(tagCatalog, form, CONTAINS);
    expect(changedForm.hierarchyValid).to.equal(false);
    expect(changedForm.get('name').value).to.equal('meta');
    expect(changedForm.get('operator').value).to.equal(CONTAINS);
    expect(changedForm.get('value').value).to.equal(undefined);
    expect(changedForm.get('key').value).to.equal('user-agent');
  });

  it('must drop the value/operator when switching the tag to one that does not support the configured value/operator', () => {
    const form = createTagForm(tagCatalog, {
      name: 'latency',
      operator: GREATER_THAN,
      value: 42
    });
    expect(form.hierarchyValid).to.equal(true);

    const changedForm = changeName(tagCatalog, form, 'application');
    expect(changedForm.hierarchyValid).to.equal(false);
    expect(changedForm.get('name').value).to.equal('application');
    expect(changedForm.get('operator').value).to.equal(EQUALS);
    expect(changedForm.get('value').value).to.equal(undefined);
  });

  it('must set default value (true) when switching the tag to one that is of type boolean', () => {
    const form = createTagForm(tagCatalog, {
      name: 'latency',
      operator: GREATER_THAN,
      value: 42
    });
    expect(form.hierarchyValid).to.equal(true);

    const changedForm = changeName(tagCatalog, form, 'erroneous');
    expect(changedForm.get('name').value).to.equal('erroneous');
    expect(changedForm.get('operator').value).to.equal(EQUALS);
    expect(changedForm.get('value').value).to.equal(true);
  });

  it('must nost drop the value/operator when switching to the same tag type', () => {
    const form = createTagForm(tagCatalog, {
      name: 'name',
      operator: CONTAINS,
      value: 'prod',
      entity: DESTINATION
    });
    expect(form.hierarchyValid).to.equal(true);

    const changedForm = changeName(tagCatalog, form, 'application');
    expect(changedForm.hierarchyValid).to.equal(true);
    expect(changedForm.get('name').value).to.equal('application');
    expect(changedForm.get('operator').value).to.equal(CONTAINS);
    expect(changedForm.get('value').value).to.equal('prod');
    expect(changedForm.get('entity')).to.equal(undefined);
  });
});
