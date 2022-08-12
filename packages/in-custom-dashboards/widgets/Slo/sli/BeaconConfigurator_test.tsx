/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { shallow } from 'enzyme';
import React from 'react';

import { Button } from '@instana/components';

import BeaconConfigurator from 'in-custom-dashboards/widgets/Slo/sli/BeaconConfigurator';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { noop } from 'in-services/util/function';
import { t } from 'in-i18n';

describe('in-custom-dashboards/widgets/Slo/sli/BeaconConfigurator', () => {
  it('does not display the QueryBuilder if sliType is "websiteEventBased"', () => {
    // Given
    const QueryBuilder = jest.fn();

    // When
    const wrapper = shallow(<BeaconConfigurator QueryBuilder={QueryBuilder} onChange={noop} value={[]} />);

    // Then
    expect(wrapper.exists(QueryBuilder)).not.toBeTruthy();
  });

  it('renders the QueryBuilder with the provided value', () => {
    // Given
    const tagFilterExpression: FormModelElement[] = [
      {
        name: 'Snacks.Available',
        operator: 'EQUALS',
        booleanValue: true,
        entity: 'DESTINATION',
        type: 'TAG_FILTER'
      }
    ];
    const QueryBuilder = jest.fn();

    // When
    const wrapper = shallow(
      <BeaconConfigurator
        QueryBuilder={QueryBuilder}
        onChange={noop}
        value={tagFilterExpression}
        withAdditionalFilters
      />
    );

    // Then
    expect(wrapper.exists(QueryBuilder)).toBeTruthy();
    expect(wrapper.find(QueryBuilder).prop('value')).toBe(tagFilterExpression);
  });

  it('calls onChange with an empty form model when the clear button is clicked', () => {
    // Given
    const tagFilterExpression: FormModelElement[] = [
      {
        name: 'Snacks.Available',
        operator: 'EQUALS',
        booleanValue: true,
        entity: 'DESTINATION',
        type: 'TAG_FILTER'
      }
    ];
    const QueryBuilder = jest.fn();
    const onChange = jest.fn();

    // When
    const wrapper = shallow(
      <BeaconConfigurator
        QueryBuilder={QueryBuilder}
        onChange={onChange}
        value={tagFilterExpression}
        withAdditionalFilters
      />
    );
    wrapper
      .find({ title: t('in-custom-dashboards:widgets.slo.sliFormPresenter.beaconFiltersLabel') })
      .dive()
      .find(Button)
      .simulate('click', {});

    // Then
    expect(onChange).toHaveBeenLastCalledWith([]);
  });

  it('calls onChange with the updated form model on changes in the QueryBuilder', () => {
    // Given
    const tagFilterExpression: FormModelElement[] = [
      {
        name: 'Snacks.Available',
        operator: 'EQUALS',
        booleanValue: true,
        entity: 'DESTINATION',
        type: 'TAG_FILTER'
      }
    ];
    const QueryBuilder = jest.fn();
    const onChange = jest.fn();

    // When
    const wrapper = shallow(
      <BeaconConfigurator
        QueryBuilder={QueryBuilder}
        onChange={onChange}
        value={tagFilterExpression}
        withAdditionalFilters
      />
    );
    wrapper.find(QueryBuilder).simulate('change', [
      {
        name: 'Snacks.Available',
        operator: 'EQUALS',
        booleanValue: false,
        entity: 'DESTINATION',
        type: 'available'
      }
    ]);

    // Then
    expect(onChange).toHaveBeenLastCalledWith([
      {
        name: 'Snacks.Available',
        operator: 'EQUALS',
        booleanValue: false,
        entity: 'DESTINATION',
        type: 'available'
      }
    ]);
  });
});
