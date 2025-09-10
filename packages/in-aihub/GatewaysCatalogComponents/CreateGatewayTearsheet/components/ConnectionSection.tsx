/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useContext } from 'react';

import { Grid, RadioButtonGroup, RadioButton, TextInput } from '@instana/carbon';
import { CreateTearsheetStep } from '@instana/ibm-products';

import useValidateForm, {
  ValidationStep
} from 'in-aihub/GatewaysCatalogComponents/CreateGatewayTearsheet/hooks/useValidateForm';
import {
  createGatewayForm,
  isFieldValid
} from 'in-aihub/GatewaysCatalogComponents/CreateGatewayTearsheet/utils/formUtils';
import GatewayFormContext from 'in-aihub/GatewaysCatalogComponents/CreateGatewayTearsheet/context/GatewayFormContext';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import HelpText from 'in-components/form/HelpText/HelpText';
import FormGroup from 'in-settings/components/FormGroup';
import Label from 'in-components/form/Label';
import { t } from 'in-i18n';

import locals from 'in-aihub/GatewaysCatalogComponents/CreateGatewayTearsheet/CreateGatewayTearsheet.mless';

export default function ConnectionSection() {
  const { form, setForm } = useContext(GatewayFormContext);
  const connection = form.get('connection');
  const validateForm = useValidateForm();

  const agentTypeField = connection.get('agentType');
  const watsonxKeyField = connection.get('watsonxKey');
  const watsonxProjectField = connection.get('watsonxProject');
  const watsonxUrlField = connection.get('watsonxUrl');
  const endpointUrlField = connection.get('endpointUrl');
  const promptField = connection.get('endpointApiKey');

  const isWatsonx = agentTypeField.value === 'IBM watsonx';

  // Validate based on the selected agent type
  const isFormValid = isWatsonx
    ? isFieldValid(watsonxKeyField) && isFieldValid(watsonxProjectField) && isFieldValid(watsonxUrlField)
    : isFieldValid(endpointUrlField) && isFieldValid(promptField);

  const handleAgentTypeChange = (value: string) => {
    const updatedForm = form.updateIn(['connection', 'agentType'], field => field.setValue(value).setTouched(true));
    setForm(createGatewayForm({ form: updatedForm }));
  };

  const handleWatsonxKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const updatedForm = form.updateIn(['connection', 'watsonxKey'], field => {
      const updatedField = field.setValue(value).setTouched(true);
      return updatedField;
    });
    setForm(createGatewayForm({ form: updatedForm }));
  };

  const handleWatsonxProjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const updatedForm = form.updateIn(['connection', 'watsonxProject'], field => {
      const updatedField = field.setValue(value).setTouched(true);
      return updatedField;
    });
    setForm(createGatewayForm({ form: updatedForm }));
  };

  const handleWatsonxUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const updatedForm = form.updateIn(['connection', 'watsonxUrl'], field => {
      const updatedField = field.setValue(value).setTouched(true);
      return updatedField;
    });
    setForm(createGatewayForm({ form: updatedForm }));
  };

  const handleEndpointUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const updatedForm = form.updateIn(['connection', 'endpointUrl'], field => {
      const updatedField = field.setValue(value).setTouched(true);
      return updatedField;
    });
    setForm(createGatewayForm({ form: updatedForm }));
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const updatedForm = form.updateIn(['connection', 'endpointApiKey'], field =>
      field.setValue(value).setTouched(true)
    );
    setForm(createGatewayForm({ form: updatedForm }));
  };

  return (
    <CreateTearsheetStep
      title={t('in-aihub:gateways.createGateway.connectionSection.title')}
      description={t('in-aihub:gateways.createGateway.connectionSection.description')}
      hasFieldset={false}
      invalid={!isFormValid}
      onNext={() => validateForm(ValidationStep.CONNECTION)}
    >
      <Grid className={locals['step-grid']}>
        <FormGroup>
          <Label htmlFor="agent-type">{t('in-aihub:gateways.createGateway.connectionSection.subtitle')}</Label>
          <RadioButtonGroup
            name="agent-type"
            onChange={value => handleAgentTypeChange(value as string)}
            orientation="horizontal"
            defaultSelected={agentTypeField.value}
            className={locals['radio-group']}
          >
            <RadioButton id="ibm-watsonx" labelText="IBM watsonx" value="IBM watsonx" />
            <RadioButton
              id="other"
              labelText={t('in-aihub:gateways.createGateway.connectionSection.other')}
              value="Other"
            />
          </RadioButtonGroup>
        </FormGroup>

        {isWatsonx ? (
          <>
            {watsonxKeyField.map(field => (
              <FormGroup>
                <Label htmlFor="watsonx-key" hasError={!field.valid && field.touched}>
                  {t('in-aihub:gateways.createGateway.connectionSection.watsonxKey')}
                </Label>
                <TextInput
                  id="watsonx-key"
                  labelText=""
                  value={field.value}
                  onChange={handleWatsonxKeyChange}
                  invalid={!field.valid && field.touched}
                  type="password"
                />
                <TouchedMessages field={field} />
                <HelpText>{t('in-aihub:gateways.createGateway.connectionSection.watsonxKeyHelperText')}</HelpText>
              </FormGroup>
            ))}

            {watsonxProjectField.map(field => (
              <FormGroup>
                <Label htmlFor="watsonx-project" hasError={!field.valid && field.touched}>
                  {t('in-aihub:gateways.createGateway.connectionSection.watsonxProject')}
                </Label>
                <TextInput
                  id="watsonx-project"
                  labelText=""
                  value={field.value}
                  onChange={handleWatsonxProjectChange}
                  invalid={!field.valid && field.touched}
                />
                <TouchedMessages field={field} />
              </FormGroup>
            ))}

            {watsonxUrlField.map(field => (
              <FormGroup>
                <Label htmlFor="watsonx-url" hasError={!field.valid && field.touched}>
                  {t('in-aihub:gateways.createGateway.connectionSection.watsonxUrl')}
                </Label>
                <TextInput
                  id="watsonx-url"
                  labelText=""
                  value={field.value}
                  onChange={handleWatsonxUrlChange}
                  invalid={!field.valid && field.touched}
                />
                <TouchedMessages field={field} />
              </FormGroup>
            ))}
          </>
        ) : (
          <>
            {endpointUrlField.map(field => (
              <FormGroup>
                <Label htmlFor="endpoint-url" hasError={!field.valid && field.touched}>
                  {t('in-aihub:gateways.createGateway.connectionSection.endpointUrl')}
                </Label>
                <TextInput
                  id="endpoint-url"
                  labelText=""
                  value={field.value}
                  onChange={handleEndpointUrlChange}
                  invalid={!field.valid && field.touched}
                />
                <TouchedMessages field={field} />
              </FormGroup>
            ))}

            {promptField.map(field => (
              <FormGroup>
                <Label htmlFor="endpointApiKey" hasError={!field.valid && field.touched}>
                  {t('in-aihub:gateways.createGateway.connectionSection.endpointApiKey')}
                </Label>
                <TextInput
                  id="endpointApiKey"
                  labelText=""
                  value={field.value}
                  onChange={handlePromptChange}
                  invalid={!field.valid && field.touched}
                  type="password"
                />
                <TouchedMessages field={field} />
              </FormGroup>
            ))}
          </>
        )}
      </Grid>
    </CreateTearsheetStep>
  );
}
