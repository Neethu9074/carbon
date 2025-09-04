/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

// eslint-disable-next-line no-restricted-imports
import { InlineLoading } from '@carbon/react';
import { Column, ContentSwitcher, Grid, Switch } from '@instana/carbon';
import { CreateTearsheetStep } from '@instana/ibm-products';

import TriggerEventTab from 'in-automation/Policies/CreatePolicyTearsheet/components/TriggerEventTab';
import TriggerScheduleTab from 'in-automation/Policies/CreatePolicyTearsheet/components/TriggerScheduleTab';
import { usePolicyFormContext } from 'in-automation/Policies/CreatePolicyTearsheet/PolicyFormContext';
import { POLICY_CONDITION } from 'in-automation/Policies/CreatePolicyTearsheet/usePolicyForm/constants';
import { PolicyCondition } from 'in-automation/Policies/CreatePolicyTearsheet/usePolicyForm/types';
import validateFormFields, {
  validateScheduleFilds
} from 'in-automation/Policies/CreatePolicyTearsheet/usePolicyForm/utils';
import { Triggers } from 'in-automation/types';
import { areFieldsValid } from 'in-automation/utils/form';
import { t } from 'in-i18n';

import local from 'in-automation/Policies/CreatePolicyTearsheet/CreatePolicyTearsheet.mless';

export default function TriggerConfigurationStep({
  triggers,
  loading
}: Readonly<{ triggers: Triggers; loading: boolean }>) {
  const { form, onChange } = usePolicyFormContext();
  const inEventPage = false;

  const conditionField = form.get('condition');
  const isFormValid = useCheckFiledsValid();
  const validateForm = useValidateForm();
  const isEvent = conditionField.value === POLICY_CONDITION.EVENT;

  return (
    <CreateTearsheetStep
      key={1}
      hasFieldset={false}
      title={t('in-automation:policyCreateTearsheet.page1.title')}
      onNext={validateForm}
      invalid={!isFormValid}
      description={t('in-automation:policyCreateTearsheet.page1.description')}
    >
      {loading ? (
        <InlineLoading
          description={t('in-automation:policyCreateTearsheet.loading')}
          iconDescription="Loading data..."
        />
      ) : (
        <Grid className={local['policy-tearsheet-step-grid']}>
          <Column lg={12} md={8}>
            <ContentSwitcher
              onChange={({ name }) => {
                onChange(['condition'], () => conditionField.setValue(name as PolicyCondition).setTouched(true));
              }}
              selectedIndex={isEvent ? 0 : 1}
              size="md"
            >
              <Switch name={POLICY_CONDITION.EVENT} text={t('in-automation:policyCreateTearsheet.event')} />
              <Switch name={POLICY_CONDITION.SCHEDULE} text={t('in-automation:policyCreateTearsheet.schedule')} />
            </ContentSwitcher>
          </Column>
          {isEvent ? <TriggerEventTab inEventPage={inEventPage} triggers={triggers} /> : <TriggerScheduleTab />}
        </Grid>
      )}
    </CreateTearsheetStep>
  );
}

function useCheckFiledsValid() {
  const { form } = usePolicyFormContext();
  const conditionField = form.get('condition');
  if (conditionField.value === POLICY_CONDITION.EVENT) {
    return areFieldsValid(form, [['triggerId'], ['action', 'type'], ['scope'], ['scope', 'applyOn']]);
  }
  const scheduleField = form.get('schedule');
  return scheduleField.hierarchyValid || !scheduleField.touched;
}

function useValidateForm() {
  const { form } = usePolicyFormContext();
  const conditionField = form.get('condition');

  if (conditionField.value === POLICY_CONDITION.EVENT) {
    return validateFormFields([['triggerId'], ['action', 'type'], ['scope'], ['scope', 'applyOn']]);
  } else {
    return validateScheduleFilds();
  }
}
