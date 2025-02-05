/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { shallow } from 'enzyme';
import React from 'react';

import AlertConfigDialog, { toAlertConfig } from 'in-alerting/smart-alerts/logs/dialog/advanced/AlertConfigDialog';
import { LogSmartAlertConfig } from 'in-alerting/smart-alerts/logs/form/logAlertConfigTypes';
import alertFormDefinition from 'in-alerting/smart-alerts/logs/form/alertFormDefinition';
import data from 'in-alerting/smart-alerts/logs/data/alertConfigData.json';
import { VersionedConfig } from 'in-types';

const mockTriggerReload = jest.fn();

describe('in-alerting/smart-alerts/logs/dialog/advanced/AlertConfigDialog', () => {
  beforeEach(() => {
    mockTriggerReload.mockClear();
    jest.resetAllMocks();
  });

  it('renders correctly when creating a new alert', () => {
    // Renders the component with the correct props and state.
    const onClose = jest.fn();
    const alertConfig = data.alertConfig as LogSmartAlertConfig & VersionedConfig & { duplicateFrom?: string };
    const editMode = false;
    const startWithSimpleMode = false;
    const wrapper = shallow(
      <AlertConfigDialog
        onClose={onClose}
        alertConfig={alertConfig}
        editMode={editMode}
        startWithSimpleMode={startWithSimpleMode}
      />
    );

    // Checks if the component renders correctly.
    expect(wrapper).toMatchInlineSnapshot(`ShallowWrapper {}`);

    // Check if actions exists and are triggered
    const createOrSaveAlert = wrapper.find('AlertConfigDialogWithThreshold').prop('onCreate');
    //@ts-expect-error this has error unknown type as this function is passed as prop to compoenent
    createOrSaveAlert();

    const onCloseAction = wrapper.find('AlertConfigDialogWithThreshold').prop('onClose');
    //@ts-expect-error this has error unknown type as this function is passed as prop to compoenent
    onCloseAction();
  });

  it('test alertFormDefinition', () => {
    const form = alertFormDefinition(data.form as unknown as LogSmartAlertConfig & VersionedConfig, false);

    const resultData = data.form;
    delete (resultData as any).hiddenFields;

    const result = toAlertConfig(form);
    expect(result).toEqual(resultData);
  });
});
