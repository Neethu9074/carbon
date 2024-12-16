/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { shallow } from 'enzyme';
import React from 'react';

import { ButtonGroup } from '@instana/components';

import MonitoringSourceSelector from 'in-custom-dashboards/widgets/SloLegacy/components/MonitoringSourceSelector';
import { MonitoringSources } from 'in-custom-dashboards/widgets/SloLegacy/constants';
import { noop } from 'in-services/util/function';
import { t } from 'in-i18n';

describe('in-custom-dashboards/widgets/SloLegacy/components/MonitoringSourceSelector', () => {
  it('renders a button for every monitoring source', () => {
    // Given
    const value = MonitoringSources[0];
    const onChange = noop;

    // When
    const wrapper = shallow(<MonitoringSourceSelector value={value} onChange={onChange} />);

    // Then
    expect(wrapper.find(ButtonGroup).props()).toEqual(
      expect.objectContaining({
        buttonPropsList: [
          expect.objectContaining({
            key: 'application',
            text: t('in-custom-dashboards:widgets.slo.monitoringSourceSelector.source', { context: 'application' })
          }),
          expect.objectContaining({
            key: 'website',
            text: t('in-custom-dashboards:widgets.slo.monitoringSourceSelector.source', { context: 'website' })
          })
        ]
      })
    );
  });

  it('calls onChange with the correct monitoring source if a button is clicked', () => {
    // Given
    const value = MonitoringSources[0];
    const onChange = jest.fn();

    // When
    const wrapper = shallow(<MonitoringSourceSelector value={value} onChange={onChange} />);
    wrapper
      .find(ButtonGroup)
      .props()
      .buttonPropsList[1] // @ts-expect-error
      .onClick?.();

    // Then
    expect(onChange).toHaveBeenLastCalledWith('website');
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('selects the button matching its value', () => {
    // Given
    const value = 'website';
    const onChange = noop;

    // When
    const wrapper = shallow(<MonitoringSourceSelector value={value} onChange={onChange} />);

    // Then
    expect(wrapper.find(ButtonGroup).props()).toEqual(
      expect.objectContaining({
        activeKey: 'website'
      })
    );
  });
});
