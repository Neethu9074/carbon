/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { shallow } from 'enzyme';
import React from 'react';

import { Button } from '@instana/components';

import TagFilterExpressionConfig from 'in-custom-dashboards/widgets/SloLegacy/sli/TagFilterExpressionConfig';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import LightCard from 'in-alerting/components/LightCard/LightCard';
import { noop } from 'in-services/util/function';
import { t } from 'in-i18n';

describe('in-custom-dashboards/widgets/SloLegacy/sli/TagFilterExpressionConfig', () => {
  it('renders a clear button if value contains elements', () => {
    // Given
    const value: FormModelElement[] = [
      { entity: 'DESTINATION', name: 'call.type', operator: 'EQUALS', value: 'HTTP', type: 'TAG_FILTER' }
    ];

    // When
    const wrapper = shallow(
      <TagFilterExpressionConfig
        label="someLabel"
        icon="lib_actions_comment"
        value={value}
        onChange={noop}
        QueryBuilderComponent={jest.fn()}
      />
    )
      .find(LightCard)
      .dive();

    // Then
    expect(
      wrapper.containsMatchingElement(
        <Button>{t('in-custom-dashboards:widgets.slo.tagFilterExpressConfig.clear')}</Button>
      )
    ).toBeTruthy();
  });

  it('renders no clear button if value is empty', () => {
    // Given
    const value: FormModelElement[] = [];

    // When
    const wrapper = shallow(
      <TagFilterExpressionConfig
        label="someLabel"
        icon="lib_actions_comment"
        value={value}
        onChange={noop}
        QueryBuilderComponent={jest.fn()}
      />
    )
      .find(LightCard)
      .dive();

    // Then
    expect(
      wrapper.containsMatchingElement(
        <Button>{t('in-custom-dashboards:widgets.slo.tagFilterExpressConfig.clear')}</Button>
      )
    ).not.toBeTruthy();
  });

  it('calls onChange with an empty list if the clear button is clicked', () => {
    // Given
    const value: FormModelElement[] = [
      { entity: 'DESTINATION', name: 'call.type', operator: 'EQUALS', value: 'HTTP', type: 'TAG_FILTER' }
    ];
    const onChange = jest.fn();

    // When
    shallow(
      <TagFilterExpressionConfig
        label="someLabel"
        icon="lib_actions_comment"
        value={value}
        onChange={onChange}
        QueryBuilderComponent={jest.fn()}
      />
    )
      .find(LightCard)
      .dive()
      .find(Button)
      .simulate('click');

    // Then
    expect(onChange).toHaveBeenLastCalledWith([]);
  });

  it('calls onChange with the update value on changes to the QueryBuilderComponent', () => {
    // Given
    const value: FormModelElement[] = [];
    const updatedValue = [
      { entity: 'DESTINATION', name: 'call.type', operator: 'EQUALS', value: 'HTTP', type: 'TAG_FILTER' }
    ];
    const onChange = jest.fn();
    const QueryBuilderComponent = jest.fn();

    // When
    shallow(
      <TagFilterExpressionConfig
        label="someLabel"
        icon="lib_actions_comment"
        value={value}
        onChange={onChange}
        QueryBuilderComponent={QueryBuilderComponent}
      />
    )
      .find(QueryBuilderComponent)
      .simulate('change', updatedValue);

    // Then
    expect(onChange).toHaveBeenLastCalledWith(updatedValue);
  });
});
