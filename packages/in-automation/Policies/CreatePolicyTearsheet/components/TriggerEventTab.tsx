/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import {
  Checkbox,
  CheckboxGroup,
  Column,
  ComboBox,
  FormGroup,
  Grid,
  Link,
  Stack
} from '@instana/carbon';

import { usePolicyFormContext } from 'in-automation/Policies/CreatePolicyTearsheet/PolicyFormContext';
import { t, Trans } from 'in-i18n';
import { role } from 'in-stores/user';

import { Spacer, Typography } from '@instana/components';
import { applyOnOptions } from 'in-automation/Policies/CreatePolicyTearsheet/usePolicyForm/constants';
import SelectTrigger from 'in-automation/Policies/NewSelectTrigger';
import { SCOPE } from 'in-automation/Policies/usePolicyForm/constants';
import { ApplyOn } from 'in-automation/Policies/usePolicyForm/types';
import { Triggers } from 'in-automation/types';
import { getValidationMessage, isFieldValid } from 'in-automation/utils/form';
import DfqSearchBar from 'in-components/SearchBar/DfqSearchBar';
import DescriptionText from 'in-components/form/DescriptionText/DescriptionText';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';

import local from 'in-automation/Policies/CreatePolicyTearsheet/CreatePolicyTearsheet.mless';

export default function TriggerEventTab({ triggers, inEventPage }: { inEventPage?: boolean; triggers: Triggers }) {
  return (
    <>
      <Column lg={16} md={8}>
        <SelectTrigger
          triggers={triggers}
          inEventPage={inEventPage}
          legendText={t('in-automation:policyCreateTearsheet.event')}
          addEventText={t('in-automation:policies.addEventCondition')}
        />
      </Column>
      <Column lg={12} md={8}>
        <TypeSection />
      </Column>
    </>
  );
}

function TypeSection() {
  const { form, setForm } = usePolicyFormContext();

  const type = form.getIn(['action', 'type']);
  const automatic = form.getIn(['action', 'type', 'automatic']);
  // const conditionWhenField = form.getIn(['conditionWhen']);

  return (
    <Stack orientation="vertical" gap={1}>
      <div>
        <Typography variant="heading-compact-01" noMargin>
          {t('in-automation:policies.policyType')}
        </Typography>
        <Typography variant="label-01">{t('in-automation:policyCreateTearsheet.policyTypeHelperText')}</Typography>
      </div>
      <CheckboxGroup
        invalid={!isFieldValid(type)}
        invalidText={getValidationMessage(type)}
        legendText=""
        orientation="vertical"
      >
        <div>
          <Checkbox
            id="manual"
            labelText={t('in-automation:policyCreateTearsheet.policyUserInitiated.label')}
            checked={type.get('manual').value}
            disabled={!role?.canConfigureAutomationPolicies}
            onChange={e =>
              setForm(form =>
                form
                  .updateIn(['action', 'type', 'manual'], item => item.setValue(e.target.checked))
                  .updateIn(['action', 'type'], item => item.setTouched(true))
              )
            }
          />
          <div className={local.subElements}>
            <Typography variant="body-small">
              {t('in-automation:policyCreateTearsheet.policyUserInitiated.helperText')}
            </Typography>
          </div>
        </div>
        <div>
          <Checkbox
            id="automatic"
            labelText={t('in-automation:policies.automatic')}
            checked={type.get('automatic').value}
            disabled={!role?.canConfigureAutomationPolicies}
            onChange={e =>
              setForm(form =>
                form
                  .updateIn(['action', 'type', 'automatic'], item => item.setValue(e.target.checked))
                  .updateIn(['action', 'type'], item => item.setTouched(true))
              )
            }
          />
          <div className={local.subElements}>
            <Typography variant="body-small">
              {t('in-automation:policyCreateTearsheet.policyAutomatic.helperText')}
            </Typography>

            {automatic.value && (
              <>
                {/* <Spacer vertical="xsmall" />
                <RadioButtonGroup
                  name="radio-button-group"
                  defaultSelected={conditionWhenField.value}
                  className={local.radioButtonGroup}
                  onChange={e => {
                    onChange(['conditionWhen'], () => conditionWhenField.setValue(e as ConditionWhen));
                  }}
                >
                  <RadioButton
                    value={CONDITION_WHEN.EVENT_OPEN}
                    id="radio-1"
                    labelText={t('in-automation:policyCreateTearsheet.conditionWhen.open')}
                  />
                  <RadioButton
                    value={CONDITION_WHEN.EVENT_CLOSE}
                    labelText={t('in-automation:policyCreateTearsheet.conditionWhen.close')}
                    id="radio-3"
                  />
                </RadioButtonGroup> */}
                <Spacer vertical="normal" />
                <ScopeSection />
              </>
            )}
          </div>
        </div>
      </CheckboxGroup>
    </Stack>
  );
}

function ScopeSection() {
  const { form, setForm } = usePolicyFormContext();

  const scope = form.get('scope');
  const applyOn = scope.get('applyOn');
  const query = scope.get('query');

  return (
    <>
      <Typography variant="label-02">{t('in-automation:policyCreateTearsheet.selectScope')}</Typography>
      <Spacer vertical="xsmall" />
      <Grid>
        <Column lg={6}>
          {applyOn.map(field => (
            <ComboBox
              key={1}
              allowCustomValue={false}
              titleText={t('in-automation:policies.applyOn')}
              id="policy-applyOn"
              invalid={!isFieldValid(field)}
              invalidText={getValidationMessage(field)}
              disabled={!role?.canConfigureAutomationPolicies}
              onChange={({ selectedItem }) =>
                setForm(form =>
                  form.updateIn(['scope', 'applyOn'], item =>
                    item.setValue(selectedItem?.value as ApplyOn).setTouched(true)
                  )
                )
              }
              items={applyOnOptions}
              selectedItem={applyOnOptions.find(({ value }) => value === field.value)}
            />
          ))}
        </Column>
        <Column lg={6}>
          {applyOn.value === SCOPE.DFQ &&
            query.map(field => (
              <FormGroup legendText={t('in-automation:policies.dynamicFocusQuery')} key={1}>
                <DfqSearchBar
                  theme="light"
                  disabled={!role?.canConfigureAutomationPolicies}
                  onQueryValueChange={value => {
                    setForm(form => form.updateIn(['scope', 'query'], item => item.setValue(value).setTouched(true)));
                  }}
                  queryValue={field.value}
                  manageFiltersDisabled
                />
                <TouchedMessages field={scope} />
                <DescriptionText>
                  <Trans
                    i18nKey="in-settings:tabs.aNonEmptyFilterQueryWhichDefinesForWhichEntitiesTheRuleWillBeApplied"
                    components={{
                      docLink: <Link size="sm" href="https://ibm.biz/dynamic-focus-syntax" external />
                    }}
                  />
                </DescriptionText>
              </FormGroup>
            ))}
        </Column>
      </Grid>
    </>
  );
}
