/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import { shallow } from 'enzyme';
import React from 'react';

import GroupingConfiguratorSection from 'in-components/GroupingConfigurator/GroupingConfiguratorSection';
import alertFormDefinition from 'in-alerting/smart-alerts/logs/form/alertFormDefinition';
import ScopeGroup from 'in-alerting/smart-alerts/logs/dialog/advanced/ScopeGroup';
import { alertConfig } from 'in-alerting/smart-alerts/logs/data/testData';
import { t } from 'in-i18n';

describe('Render Scope Group in Log SA dialog : in-alerting/smart-alerts/logs/dialog/advanced/ScopeGroup', () => {
  const form = alertFormDefinition(alertConfig, false);
  const updateForm = jest.fn();

  it('Check if component rendered in UI', () => {
    render(<ScopeGroup form={form} updateForm={updateForm} />);
    expect(screen.getByText(t('in-components:groupingConfigurator.titleGroup'))).toBeInTheDocument();
  });

  it('Trigger formupdate through onchange', () => {
    const wrapper = shallow(<ScopeGroup form={form} updateForm={updateForm} />);
    wrapper.find(GroupingConfiguratorSection).props().onChange();
    expect(updateForm).toHaveBeenCalled();
  });
});
