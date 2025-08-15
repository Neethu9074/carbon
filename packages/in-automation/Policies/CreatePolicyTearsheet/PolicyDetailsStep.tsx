/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { FormGroup, Stack, TextArea, TextInput } from '@instana/carbon';
import { CreateTearsheetStep } from '@instana/ibm-products';
import { Error } from '@instana/types';

import usePolicyTags from 'in-automation/hooks/usePolicyTags';
import { usePolicyFormContext } from 'in-automation/Policies/CreatePolicyTearsheet/PolicyFormContext';
import validateFormFields from 'in-automation/Policies/CreatePolicyTearsheet/usePolicyForm/utils';
import { areFieldsValid } from 'in-automation/utils/form';
import CreatableTagSelect from 'in-components/CreatableTagSelect/CreatableTagSelect';
import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter/ErroneousResultPresenter';
import { t } from 'in-i18n';
import { isLoading } from 'in-services/util/result';
import { role } from 'in-stores/user';

export default function PolicyDetailsStep({ errors }: Readonly<{ errors: Error[] | undefined }>) {
  const { form } = usePolicyFormContext();
  const isFormValid = areFieldsValid(form, [['name'], ['description']]);
  const validateForm = validateFormFields([['name'], ['description']]);
  return (
    <CreateTearsheetStep
      key={2}
      hasFieldset={false}
      title={'Enter Details'}
      onNext={validateForm}
      invalid={!isFormValid}
    >
      <ErroneousResultPresenter errors={errors} />
      <DetailsSection />
    </CreateTearsheetStep>
  );
}

function DetailsSection() {
  const { form, setForm } = usePolicyFormContext();
  const availableTags = usePolicyTags();

  const name = form.get('name');
  const description = form.get('description');
  const tags = form.get('tags');

  return (
    <Stack orientation="vertical" gap={6}>
      {name.map(field => (
        <TextInput
          key={1}
          id="policy-name"
          labelText={t('in-automation:name')}
          value={field.value}
          disabled={!role?.canConfigureAutomationPolicies}
          onChange={e =>
            setForm(form => form.updateIn(['name'], item => item.setValue(e.target.value).setTouched(true)))
          }
          invalid={!field.valid && field.touched}
          maxLength={256}
          autoFocus
          invalidText={field.messages[0]?.message ?? ''}
          helperText={'Enter a name for the policy. '}
        />
      ))}
      {description.map(field => (
        <TextArea
          key={2}
          labelText={t('in-automation:description')}
          id="policy-description"
          value={field.value}
          disabled={!role?.canConfigureAutomationPolicies}
          onChange={e =>
            setForm(form =>
              form.updateIn(['description'], item =>
                item.setValue((e.target as HTMLTextAreaElement).value).setTouched(true)
              )
            )
          }
          invalid={!field.valid && field.touched}
          invalidText={field.messages[0]?.message ?? ''}
          helperText="Provide a description for the policy."
        />
      ))}
      {tags.map(field => (
        <FormGroup legendText={t('in-automation:tags')} key={3}>
          <CreatableTagSelect
            id="policy-tags"
            isLoading={isLoading(availableTags)}
            tags={availableTags.data}
            value={field.value}
            onChange={newTags =>
              setForm(form => form.updateIn(['tags'], item => item.setValue(newTags).setTouched(true)))
            }
            disabled={!role?.canConfigureAutomationActions}
          />
        </FormGroup>
      ))}
    </Stack>
  );
}
