/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { shallow } from 'enzyme';
import React from 'react';

import { createSmartAlertForm } from 'in-alerting/smart-alerts/applications/form/smartAlertForm';
import AlertingTearSheetFooter from 'in-alerting/components/AlertingTearSheetFooter';

const alertConfig = {
  threshold: {
    type: 'staticThreshold'
  }
};
//@ts-expect-error
const form = createSmartAlertForm(alertConfig, false, false);

describe('in-alerting/components/AlertingTearSheetFooter', () => {
  it('renders correctly with no actions', () => {
    const wrapper = shallow(
      <AlertingTearSheetFooter
        form={form}
        formId={'test'}
        actions={[]}
        isSaving={false}
        step={0}
        stepConfigs={[]}
        setForm={jest.fn()}
        additionalValidationCheck={false}
      />
    );

    expect(wrapper).toMatchInlineSnapshot(`ShallowWrapper {}`);
  });

  it('renders correctly with actions', () => {
    const actions = [
      {
        kind: 'ghost',
        isLeftAlign: true,
        label: 'Cancel',
        href: '/#/applications',
        onClick: jest.fn()
      },
      {
        kind: 'secondary',
        isLeftAlign: false,
        label: 'Previous',
        onClick: jest.fn()
      },
      {
        kind: 'primary',
        isLeftAlign: false,
        label: 'Create',
        onClick: jest.fn()
      }
    ];
    const wrapper = shallow(
      <AlertingTearSheetFooter
        form={form}
        formId={'test'}
        actions={actions}
        isSaving={false}
        step={0}
        stepConfigs={[]}
        setForm={jest.fn()}
        additionalValidationCheck
      />
    );

    expect(wrapper).toMatchInlineSnapshot(`ShallowWrapper {}`);
  });
});
