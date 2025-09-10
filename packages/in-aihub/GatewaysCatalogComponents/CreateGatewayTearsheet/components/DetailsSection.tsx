/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useContext } from 'react';

import { CreateTearsheetStep } from '@instana/ibm-products';
import { Grid, TextInput, TextArea } from '@instana/carbon';
import type { Error } from '@instana/types';

import useValidateForm, {
  ValidationStep
} from 'in-aihub/GatewaysCatalogComponents/CreateGatewayTearsheet/hooks/useValidateForm';
import {
  createGatewayForm,
  isFieldValid
} from 'in-aihub/GatewaysCatalogComponents/CreateGatewayTearsheet/utils/formUtils';
import GatewayFormContext from 'in-aihub/GatewaysCatalogComponents/CreateGatewayTearsheet/context/GatewayFormContext';
import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter/ErroneousResultPresenter';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import HelpText from 'in-components/form/HelpText/HelpText';
import FormGroup from 'in-settings/components/FormGroup';
import { FetchStatus } from 'in-hooks/utils/types';
import Label from 'in-components/form/Label';
import { t } from 'in-i18n';

import locals from 'in-aihub/GatewaysCatalogComponents/CreateGatewayTearsheet/CreateGatewayTearsheet.mless';

interface DetailsSectionProps {
  submitStatus?: FetchStatus;
  errors: Error[] | undefined;
}

export default function DetailsSection({ submitStatus, errors }: DetailsSectionProps) {
  const { form, setForm } = useContext(GatewayFormContext);
  const details = form.get('details');
  const validateForm = useValidateForm();

  const nameField = details.get('name');
  const descriptionField = details.get('description');

  const isFormValid = isFieldValid(nameField);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const updatedForm = form.updateIn(['details', 'name'], field => {
      const updatedField = field.setValue(value).setTouched(true);
      return updatedField;
    });
    setForm(createGatewayForm({ form: updatedForm }));
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const updatedForm = form.updateIn(['details', 'description'], field =>
      field.setValue(e.target.value).setTouched(true)
    );
    setForm(createGatewayForm({ form: updatedForm }));
  };

  return (
    <CreateTearsheetStep
      title={t('in-aihub:gateways.createGateway.details.title')}
      hasFieldset={false}
      disableSubmit={submitStatus === 'pending'}
      invalid={!isFormValid}
      onNext={() => validateForm(ValidationStep.DETAILS)}
    >
      <ErroneousResultPresenter errors={errors} />
      <Grid className={locals['step-grid']}>
        {nameField.map(field => (
          <FormGroup>
            <Label htmlFor="gateway-name" hasError={!field.valid && field.touched}>
              {t('in-aihub:gateways.createGateway.details.name')}
            </Label>
            <TextInput
              id="gateway-name"
              labelText=""
              value={field.value}
              onChange={handleNameChange}
              invalid={!field.valid && field.touched}
            />
            <TouchedMessages field={field} />
            <HelpText>{t('in-aihub:gateways.createGateway.details.nameHelper')}</HelpText>
          </FormGroup>
        ))}

        {descriptionField.map(field => (
          <FormGroup>
            <Label htmlFor="gateway-description" hasError={!field.valid && field.touched}>
              {t('in-aihub:gateways.createGateway.details.description')}
            </Label>
            <TextArea
              id="gateway-description"
              labelText=""
              value={field.value}
              onChange={handleDescriptionChange}
              rows={4}
              maxCount={200}
              invalid={!field.valid && field.touched}
            />
            <TouchedMessages field={field} />
            <HelpText>{t('in-aihub:gateways.createGateway.details.descriptionHelper')}</HelpText>
          </FormGroup>
        ))}
      </Grid>
    </CreateTearsheetStep>
  );
}
