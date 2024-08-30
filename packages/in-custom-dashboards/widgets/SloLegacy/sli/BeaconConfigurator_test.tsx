/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { createField, Field, ValidationResult } from 'formalistic';
import { shallow } from 'enzyme';
import React from 'react';

import { Button } from '@instana/components';

import BeaconSelectInSection from 'in-custom-dashboards/widgets/SloLegacy/sli/BeaconSelectInSection';
import BeaconConfigurator from 'in-custom-dashboards/widgets/SloLegacy/sli/BeaconConfigurator';
import { AvailableBeaconTypes } from 'in-custom-dashboards/widgets/SloLegacy/sli/sliTypes';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import Section from 'in-components/workspace/Section';
import { noop } from 'in-services/util/function';

describe('in-custom-dashboards/widgets/SloLegacy/sli/BeaconConfigurator', () => {
  it('renders beacon type selection in non-erroneous state if beacon type field is valid and was touched', () => {
    // Given
    const QueryBuilder = jest.fn();
    const beaconOptions = ['httpRequest', 'custom', 'pageLoad'] as const;
    const beaconTypeField = createField<AvailableBeaconTypes>({
      value: 'httpRequest',
      touched: true,
      validator: (): ValidationResult => null
    });

    // When
    const wrapper = shallow(
      <BeaconConfigurator
        beaconOptions={beaconOptions}
        QueryBuilder={QueryBuilder}
        onChangeBeaconType={noop}
        onChangeTagFilterExpression={noop}
        tagFilterExpressionField={createField({ value: [] })}
        beaconTypeField={beaconTypeField}
      />
    );

    // Then
    expect(wrapper.find(BeaconSelectInSection).prop('hasError')).toBeFalsy();
  });

  it('renders beacon type selection in erroneous state if beacon type field was touched and is not valid', () => {
    // Given
    const QueryBuilder = jest.fn();
    const beaconOptions = ['httpRequest', 'custom', 'pageLoad'] as const;
    const beaconTypeField = createField<AvailableBeaconTypes>({
      value: 'httpRequest',
      touched: true,
      validator: (): ValidationResult => [{ message: 'error', severity: 'error' }]
    });

    // When
    const wrapper = shallow(
      <BeaconConfigurator
        beaconOptions={beaconOptions}
        QueryBuilder={QueryBuilder}
        onChangeBeaconType={noop}
        onChangeTagFilterExpression={noop}
        tagFilterExpressionField={createField({ value: [] })}
        beaconTypeField={beaconTypeField}
      />
    );

    // Then
    expect(wrapper.find(BeaconSelectInSection).prop('hasError')).toBeTruthy();
  });

  it('does not display the QueryBuilder if sliType is "websiteEventBased"', () => {
    // Given
    const QueryBuilder = jest.fn();

    // When
    const wrapper = shallow(
      <BeaconConfigurator
        beaconOptions={['httpRequest']}
        QueryBuilder={QueryBuilder}
        onChangeBeaconType={noop}
        onChangeTagFilterExpression={noop}
        tagFilterExpressionField={createField({ value: [] })}
      />
    );

    // Then
    expect(wrapper.exists(QueryBuilder)).not.toBeTruthy();
  });

  it('renders the QueryBuilder with the provided value', () => {
    // Given
    const tagFilterExpressionField: Field<FormModelElement[]> = createField({
      value: [
        {
          name: 'Snacks.Available',
          operator: 'EQUALS',
          booleanValue: true,
          entity: 'DESTINATION',
          type: 'TAG_FILTER'
        }
      ]
    });
    const QueryBuilder = jest.fn();

    // When
    const wrapper = shallow(
      <BeaconConfigurator
        beaconOptions={['httpRequest']}
        QueryBuilder={QueryBuilder}
        onChangeBeaconType={noop}
        onChangeTagFilterExpression={noop}
        tagFilterExpressionField={tagFilterExpressionField}
        withAdditionalFilters
      />
    );

    // Then
    expect(wrapper.exists(QueryBuilder)).toBeTruthy();
    expect(wrapper.find(QueryBuilder).prop('value')).toBe(tagFilterExpressionField.value);
  });

  it('calls onChange with an empty form model when the clear button is clicked', () => {
    // Given
    const tagFilterExpressionField: Field<FormModelElement[]> = createField({
      value: [
        {
          name: 'Snacks.Available',
          operator: 'EQUALS',
          booleanValue: true,
          entity: 'DESTINATION',
          type: 'TAG_FILTER'
        }
      ]
    });
    const QueryBuilder = jest.fn();
    const onChangeTagFilterExpression = jest.fn();

    // When
    const wrapper = shallow(
      <BeaconConfigurator
        beaconOptions={['httpRequest']}
        QueryBuilder={QueryBuilder}
        onChangeBeaconType={noop}
        onChangeTagFilterExpression={onChangeTagFilterExpression}
        tagFilterExpressionField={tagFilterExpressionField}
        withAdditionalFilters
      />
    );
    wrapper.find(Section).dive().find(Button).simulate('click', {});

    // Then
    expect(onChangeTagFilterExpression).toHaveBeenLastCalledWith([]);
  });

  it('calls onChange with the updated form model on changes in the QueryBuilder', () => {
    // Given

    const tagFilterExpressionField: Field<FormModelElement[]> = createField({
      value: [
        {
          name: 'Snacks.Available',
          operator: 'EQUALS',
          booleanValue: true,
          entity: 'DESTINATION',
          type: 'TAG_FILTER'
        }
      ]
    });
    const QueryBuilder = jest.fn();
    const onChange = jest.fn();

    // When
    const wrapper = shallow(
      <BeaconConfigurator
        beaconOptions={['httpRequest']}
        QueryBuilder={QueryBuilder}
        onChangeBeaconType={noop}
        onChangeTagFilterExpression={onChange}
        tagFilterExpressionField={tagFilterExpressionField}
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
