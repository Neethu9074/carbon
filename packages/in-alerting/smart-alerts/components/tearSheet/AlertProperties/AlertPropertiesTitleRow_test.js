/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import AlertPropertiesTitleRow from 'in-alerting/smart-alerts/components/tearSheet/AlertProperties/AlertPropertiesTitleRow';
import { insertPlaceholderText } from 'in-alerting/smart-alerts/utils/alertPropertiesTitleUtils';
import { createSmartAlertForm } from 'in-alerting/smart-alerts/applications/form/smartAlertForm';
import { alertConfig } from 'in-alerting/smart-alerts/applications/data/alertConfigData.json';
import { getTitlePlaceholder } from 'in-alerting/smart-alerts/applications/form/formUtils';
import { t } from 'in-i18n';

describe('AlertPropertiesTitleRow : in-alerting/smart-alerts/components/tearSheet/AlertProperties/AlertPropertiesTitleRow', () => {
  const onChange = jest.fn();
  const form = createSmartAlertForm(alertConfig, true, true);
  const user = userEvent.setup();
  const placeholders = [
    {
      template: '${application.name}',
      name: 'application-name'
    }
  ];
  it('should render correctly', async () => {
    render(
      <AlertPropertiesTitleRow
        form={form}
        onChange={onChange}
        getTitlePlaceholder={getTitlePlaceholder}
        placeholders={placeholders}
      />
    );
    expect(
      screen.getByText(t('in-alerting:smartAlerts.components.smartAlertDialog.alertPropertiesTitle'))
    ).toBeInTheDocument();
    expect(
      screen.getByText(t('in-alerting:smartAlerts.components.smartAlertDialog.alertPropertyInsertPlaceholderLabel'))
    ).toBeInTheDocument();
    const input = document.getElementById('name');
    await user.type(input, 'some text');
    expect(onChange).toHaveBeenCalled();
  });

  it('should render and click placeholder', async () => {
    render(
      <AlertPropertiesTitleRow
        form={form}
        onChange={onChange}
        getTitlePlaceholder={getTitlePlaceholder}
        placeholders={placeholders}
      />
    );
    const placeholderText = screen.getByText(
      t('in-alerting:smartAlerts.components.smartAlertDialog.alertPropertyInsertPlaceholderLabel')
    );
    fireEvent.click(placeholderText);
    insertPlaceholderText(form.get('name').value, placeholders[0].template, onChange);
    expect(onChange).toHaveBeenCalled();
  });
});
