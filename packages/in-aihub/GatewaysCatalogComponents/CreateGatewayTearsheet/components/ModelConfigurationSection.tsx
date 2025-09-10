/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

// eslint-disable-next-line no-restricted-imports
import { Slider } from '@carbon/react';
import React, { useContext } from 'react';

import { CreateTearsheetStep } from '@instana/ibm-products';
import { Grid, NumberInput } from '@instana/carbon';

import useValidateForm, {
  ValidationStep
} from 'in-aihub/GatewaysCatalogComponents/CreateGatewayTearsheet/hooks/useValidateForm';
import GatewayFormContext from 'in-aihub/GatewaysCatalogComponents/CreateGatewayTearsheet/context/GatewayFormContext';
import { createGatewayForm } from 'in-aihub/GatewaysCatalogComponents/CreateGatewayTearsheet/utils/formUtils';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import HelpText from 'in-components/form/HelpText/HelpText';
import FormGroup from 'in-settings/components/FormGroup';
import Label from 'in-components/form/Label';
import { t } from 'in-i18n';

import locals from 'in-aihub/GatewaysCatalogComponents/CreateGatewayTearsheet/CreateGatewayTearsheet.mless';

export default function ModelConfigurationSection() {
  const { form, setForm } = useContext(GatewayFormContext);
  const modelConfiguration = form.get('modelConfiguration');
  const validateForm = useValidateForm();

  const tokenLimitField = modelConfiguration.get('tokenLimit');
  const maxLatencyField = modelConfiguration.get('maxLatency');
  const repetitionPenaltyField = modelConfiguration.get('repetitionPenalty');
  const temperatureField = modelConfiguration.get('temperature');
  const topKField = modelConfiguration.get('topK');
  const topPField = modelConfiguration.get('topP');

  const handleTokenLimitChange = (value: number) => {
    const updatedForm = form.updateIn(['modelConfiguration', 'tokenLimit'], field =>
      field.setValue(value).setTouched(true)
    );
    setForm(createGatewayForm({ form: updatedForm }));
  };

  const handleMaxLatencyChange = (value: number) => {
    const updatedForm = form.updateIn(['modelConfiguration', 'maxLatency'], field =>
      field.setValue(value).setTouched(true)
    );
    setForm(createGatewayForm({ form: updatedForm }));
  };

  const handleRepetitionPenaltyChange = (value: number) => {
    const updatedForm = form.updateIn(['modelConfiguration', 'repetitionPenalty'], field =>
      field.setValue(value).setTouched(true)
    );
    setForm(createGatewayForm({ form: updatedForm }));
  };

  const handleTemperatureChange = (value: number) => {
    const updatedForm = form.updateIn(['modelConfiguration', 'temperature'], field =>
      field.setValue(value).setTouched(true)
    );
    setForm(createGatewayForm({ form: updatedForm }));
  };

  const handleTopKChange = (value: number) => {
    const updatedForm = form.updateIn(['modelConfiguration', 'topK'], field => field.setValue(value).setTouched(true));
    setForm(createGatewayForm({ form: updatedForm }));
  };

  const handleTopPChange = (value: number) => {
    const updatedForm = form.updateIn(['modelConfiguration', 'topP'], field => field.setValue(value).setTouched(true));
    setForm(createGatewayForm({ form: updatedForm }));
  };

  return (
    <CreateTearsheetStep
      title={t('in-aihub:gateways.createGateway.modelConfiguration.title')}
      hasFieldset={false}
      onNext={() => validateForm(ValidationStep.MODEL_CONFIGURATION)}
    >
      <Grid className={locals['step-grid']}>
        {tokenLimitField.map(field => (
          <FormGroup>
            <Label htmlFor="token-limit" hasError={!field.valid && field.touched}>
              {t('in-aihub:gateways.createGateway.modelConfiguration.tokenLimit')}
            </Label>
            <NumberInput
              id="token-limit"
              min={1}
              max={200000}
              value={field.value}
              onChange={(_e, state) => handleTokenLimitChange(Number(state.value))}
              invalid={!field.valid && field.touched}
            />
            <TouchedMessages field={field} />
            <HelpText>{t('in-aihub:gateways.createGateway.modelConfiguration.tokenLimitHelper')}</HelpText>
          </FormGroup>
        ))}

        {maxLatencyField.map(field => (
          <FormGroup>
            <Label htmlFor="max-latency" hasError={!field.valid && field.touched}>
              {t('in-aihub:gateways.createGateway.modelConfiguration.maxLatency')}
            </Label>
            <NumberInput
              id="max-latency"
              min={1}
              max={30}
              step={1}
              value={field.value}
              onChange={(_e, state) => handleMaxLatencyChange(Number(state.value))}
              invalid={!field.valid && field.touched}
            />
            <TouchedMessages field={field} />
            <HelpText>{t('in-aihub:gateways.createGateway.modelConfiguration.maxLatencyHelper')}</HelpText>
          </FormGroup>
        ))}

        {repetitionPenaltyField.map(field => (
          <FormGroup>
            <Label htmlFor="repetition-penalty" hasError={!field.valid && field.touched}>
              {t('in-aihub:gateways.createGateway.modelConfiguration.repetitionPenalty')}
            </Label>
            <NumberInput
              id="repetition-penalty"
              min={1}
              max={2}
              step={1}
              value={field.value}
              onChange={(_e, state) => handleRepetitionPenaltyChange(Number(state.value))}
              invalid={!field.valid && field.touched}
            />
            <TouchedMessages field={field} />
            <HelpText>{t('in-aihub:gateways.createGateway.modelConfiguration.repetitionPenaltyHelper')}</HelpText>
          </FormGroup>
        ))}

        {temperatureField.map(field => (
          <FormGroup>
            <Slider
              ariaLabelInput={t('in-aihub:gateways.createGateway.modelConfiguration.temperature')}
              labelText={t('in-aihub:gateways.createGateway.modelConfiguration.temperature')}
              min={0}
              max={2}
              step={1}
              stepMultiplier={1}
              unstable_ariaLabelInputUpper="Upper bound"
              value={field.value}
              onChange={({ value }: { value: number }) => handleTemperatureChange(Number(value))}
            />
            <TouchedMessages field={field} />
            <HelpText>{t('in-aihub:gateways.createGateway.modelConfiguration.temperatureHelper')}</HelpText>
          </FormGroup>
        ))}

        {topKField.map(field => (
          <FormGroup>
            <Label htmlFor="top-k" hasError={!field.valid && field.touched}>
              {t('in-aihub:gateways.createGateway.modelConfiguration.topK')}
            </Label>
            <NumberInput
              id="top-k"
              min={1}
              value={field.value}
              onChange={(_e, state) => handleTopKChange(Number(state.value))}
              invalid={!field.valid && field.touched}
            />
            <TouchedMessages field={field} />
            <HelpText>{t('in-aihub:gateways.createGateway.modelConfiguration.topKHelper')}</HelpText>
          </FormGroup>
        ))}

        {topPField.map(field => (
          <FormGroup>
            <Label htmlFor="top-p" hasError={!field.valid && field.touched}>
              {t('in-aihub:gateways.createGateway.modelConfiguration.topP')}
            </Label>
            <NumberInput
              id="top-p"
              min={0}
              max={1}
              step={0.1}
              value={field.value}
              onChange={(_e, state) => handleTopPChange(Number(state.value))}
              invalid={!field.valid && field.touched}
            />
            <TouchedMessages field={field} />
            <HelpText>{t('in-aihub:gateways.createGateway.modelConfiguration.topPHelper')}</HelpText>
          </FormGroup>
        ))}
      </Grid>
    </CreateTearsheetStep>
  );
}
