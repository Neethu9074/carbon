/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { createField, createMapForm, Field, MapForm } from 'formalistic';
import { shallow } from 'enzyme';
import React from 'react';

import GoodBadEventsConfigurator from 'in-custom-dashboards/widgets/SloLegacy/sli/GoodBadEventsConfigurator';
import TagFilterExpressionConfig from 'in-custom-dashboards/widgets/SloLegacy/sli/TagFilterExpressionConfig';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { getIconByType as gIBT } from 'in-analyze/AnalyzeView/dataSources';
import { noop } from 'in-services/util/function';

const getIconByType = gIBT as jest.MockedFunction<typeof gIBT>;

jest.mock('in-analyze/AnalyzeView/dataSources', () => ({
  getIconByType: jest.fn()
}));

describe('in-custom-dashboards/widgets/SloLegacy/sli/GoodBadEventsConfigurator', () => {
  const baseForm = createMapForm({
    items: {
      goodEventFilterExpression: createField({ value: [] }),
      badEventFilterExpression: createField({ value: [] }),
      beaconType: createField({ value: '' })
    }
  });

  beforeEach(jest.clearAllMocks);

  it('renders a TagFilterExpressionConfig for the good events expression', () => {
    // Given
    const form = baseForm.updateIn(['goodEventFilterExpression'], f =>
      (f as Field<FormModelElement[]>).setValue([
        { entity: 'DESTINATION', name: 'call.type', operator: 'EQUALS', value: 'HTTP', type: 'TAG_FILTER' }
      ])
    );

    // When
    const wrapper = shallow(
      <GoodBadEventsConfigurator
        entityType="application"
        label="someLabel"
        form={form}
        updateForm={noop}
        QueryBuilderComponent={jest.fn()}
      />
    );

    // Then
    expect(
      wrapper.containsMatchingElement(
        //@ts-expect-error
        <TagFilterExpressionConfig
          value={[{ entity: 'DESTINATION', name: 'call.type', operator: 'EQUALS', value: 'HTTP', type: 'TAG_FILTER' }]}
        />
      )
    ).toBeTruthy();
  });

  it('renders a TagFilterExpressionConfig for the bad events expression', () => {
    // Given
    const form = baseForm.updateIn(['badEventFilterExpression'], f =>
      (f as Field<FormModelElement[]>).setValue([
        { entity: 'DESTINATION', name: 'call.type', operator: 'NOT_EQUAL', value: 'HTTP', type: 'TAG_FILTER' }
      ])
    );

    // When
    const wrapper = shallow(
      <GoodBadEventsConfigurator
        entityType="application"
        label="someLabel"
        form={form}
        updateForm={noop}
        QueryBuilderComponent={jest.fn()}
      />
    );

    // Then
    expect(
      wrapper.containsMatchingElement(
        //@ts-expect-error
        <TagFilterExpressionConfig
          value={[
            { entity: 'DESTINATION', name: 'call.type', operator: 'NOT_EQUAL', value: 'HTTP', type: 'TAG_FILTER' }
          ]}
        />
      )
    ).toBeTruthy();
  });

  it('updates the form for changes to the good events expression', () => {
    // Given
    const formUpdateCaptor = jest.fn();
    const updateForm = (updatedForm: MapForm<any>) => formUpdateCaptor(updatedForm.toJS());

    // When
    shallow(
      <GoodBadEventsConfigurator
        entityType="application"
        label="someLabel"
        form={baseForm}
        updateForm={updateForm}
        QueryBuilderComponent={jest.fn()}
      />
    )
      .find(TagFilterExpressionConfig)
      .first()
      .simulate('change', [
        { entity: 'DESTINATION', name: 'call.type', operator: 'EQUALS', value: 'HTTP', type: 'TAG_FILTER' }
      ]);

    // Then
    expect(formUpdateCaptor).toHaveBeenLastCalledWith(
      expect.objectContaining({
        goodEventFilterExpression: [
          { entity: 'DESTINATION', name: 'call.type', operator: 'EQUALS', value: 'HTTP', type: 'TAG_FILTER' }
        ]
      })
    );
  });

  it('updates the form for changes to the bad events expression', () => {
    // Given
    const formUpdateCaptor = jest.fn();
    const updateForm = (updatedForm: MapForm<any>) => formUpdateCaptor(updatedForm.toJS());

    // When
    shallow(
      <GoodBadEventsConfigurator
        entityType="application"
        label="someLabel"
        form={baseForm}
        updateForm={updateForm}
        QueryBuilderComponent={jest.fn()}
      />
    )
      .find(TagFilterExpressionConfig)
      .at(1)
      .simulate('change', [
        { entity: 'DESTINATION', name: 'call.type', operator: 'EQUALS', value: 'HTTP', type: 'TAG_FILTER' }
      ]);

    // Then
    expect(formUpdateCaptor).toHaveBeenLastCalledWith(
      expect.objectContaining({
        badEventFilterExpression: [
          { entity: 'DESTINATION', name: 'call.type', operator: 'EQUALS', value: 'HTTP', type: 'TAG_FILTER' }
        ]
      })
    );
  });

  it('renders the application icon on the TagFilterExpressionConfigs for application slis', () => {
    // Given
    const entityType = 'application';

    // When
    const wrapper = shallow(
      <GoodBadEventsConfigurator
        entityType={entityType}
        label="someLabel"
        form={baseForm}
        updateForm={noop}
        QueryBuilderComponent={jest.fn()}
      />
    );

    // Then
    // @ts-expect-error
    expect(wrapper.containsMatchingElement(<TagFilterExpressionConfig icon="lib_application" />)).toBeTruthy();
  });

  it('renders the icon for the selected beacon type on the TagFilterExpressionConfigs for website slis', () => {
    // Given
    const entityType = 'website';
    const form = baseForm.updateIn(['beaconType'], f => (f as Field<string>).setValue('smokeSigns'));
    getIconByType.mockReturnValueOnce('lib_smoke_signs');

    // When
    const wrapper = shallow(
      <GoodBadEventsConfigurator
        entityType={entityType}
        label="someLabel"
        form={form}
        updateForm={noop}
        QueryBuilderComponent={jest.fn()}
      />
    );

    // Then
    expect(getIconByType).toHaveBeenLastCalledWith('smokeSigns', 'website');
    // @ts-expect-error
    expect(wrapper.containsMatchingElement(<TagFilterExpressionConfig icon="lib_smoke_signs" />)).toBeTruthy();
  });
});
