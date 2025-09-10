/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { useContext } from 'react';

import GatewayFormContext from 'in-aihub/GatewaysCatalogComponents/CreateGatewayTearsheet/context/GatewayFormContext';

export enum ValidationStep {
  CONNECTION = 'CONNECTION',
  MODEL_SELECTION = 'MODEL_SELECTION',
  MODEL_CONFIGURATION = 'MODEL_CONFIGURATION',
  DETAILS = 'DETAILS'
}

export default function useValidateForm() {
  const { form, setForm } = useContext(GatewayFormContext);

  const validateConnectionStep = () => {
    const connection = form.get('connection');
    const agentTypeField = connection.get('agentType');
    const isWatsonx = agentTypeField.value === 'IBM watsonx';

    if (isWatsonx) {
      const watsonxKeyField = connection.get('watsonxKey');
      const watsonxProjectField = connection.get('watsonxProject');
      const watsonxUrlField = connection.get('watsonxUrl');

      // Check if required fields have values
      if (!watsonxKeyField.value || !watsonxProjectField.value || !watsonxUrlField.value) {
        return false;
      }

      // Also check if touched fields are valid
      if (
        (watsonxKeyField.touched && !watsonxKeyField.valid) ||
        (watsonxProjectField.touched && !watsonxProjectField.valid) ||
        (watsonxUrlField.touched && !watsonxUrlField.valid)
      ) {
        return false;
      }
    } else {
      const endpointUrlField = connection.get('endpointUrl');
      const endpointApiKeyField = connection.get('endpointApiKey');

      // Check if required field has a value
      if (!endpointUrlField.value || !endpointApiKeyField.value) {
        return false;
      }

      // Also check if touched field is valid
      if (
        (endpointUrlField.touched && !endpointUrlField.valid) ||
        (endpointApiKeyField.touched && !endpointApiKeyField.valid)
      ) {
        return false;
      }
    }

    return true;
  };

  const validateModelSelectionStep = () => {
    const modelSelection = form.get('modelSelection');
    const taskTypeField = modelSelection.get('taskType');
    const modelTypeField = modelSelection.get('modelType');

    // Check if required fields have values
    if (!taskTypeField.value || !modelTypeField.value) {
      return false;
    }

    // Also check if touched fields are valid
    if ((taskTypeField.touched && !taskTypeField.valid) || (modelTypeField.touched && !modelTypeField.valid)) {
      return false;
    }

    return true;
  };

  const validateModelConfigurationStep = () => {
    const modelConfiguration = form.get('modelConfiguration');
    const tokenLimitField = modelConfiguration.get('tokenLimit');
    const repetitionPenaltyField = modelConfiguration.get('repetitionPenalty');
    const temperatureField = modelConfiguration.get('temperature');
    const topKField = modelConfiguration.get('topK');
    const topPField = modelConfiguration.get('topP');

    // Check if required fields have values
    if (
      !tokenLimitField.value ||
      !repetitionPenaltyField.value ||
      !temperatureField.value ||
      !topKField.value ||
      !topPField.value
    ) {
      return false;
    }

    // Also check if touched fields are valid
    if (
      (tokenLimitField.touched && !tokenLimitField.valid) ||
      (repetitionPenaltyField.touched && !repetitionPenaltyField.valid) ||
      (temperatureField.touched && !temperatureField.valid) ||
      (topKField.touched && !topKField.valid) ||
      (topPField.touched && !topPField.valid)
    ) {
      return false;
    }

    return true;
  };

  const validateDetailsStep = () => {
    const details = form.get('details');
    const nameField = details.get('name');

    // Check if required field has a value
    if (!nameField.value) {
      return false;
    }

    // Also check if touched field is valid
    if (nameField.touched && !nameField.valid) {
      return false;
    }

    return true;
  };

  return (step?: ValidationStep) =>
    new Promise<void>((resolve, reject) => {
      let updatedForm = form;
      let isValid = true;

      // Only mark the relevant fields as touched based on the current step
      if (step) {
        const connection = form.get('connection');
        const agentTypeField = connection.get('agentType');
        const isWatsonx = agentTypeField.value === 'IBM watsonx';

        switch (step) {
          case ValidationStep.CONNECTION:
            if (isWatsonx) {
              updatedForm = form
                .updateIn(['connection', 'watsonxKey'], field => field.setTouched(true))
                .updateIn(['connection', 'watsonxProject'], field => field.setTouched(true))
                .updateIn(['connection', 'watsonxUrl'], field => field.setTouched(true));
            } else {
              updatedForm = form
                .updateIn(['connection', 'endpointUrl'], field => field.setTouched(true))
                .updateIn(['connection', 'endpointApiKey'], field => field.setTouched(true));
            }
            break;
          case ValidationStep.MODEL_SELECTION:
            updatedForm = form
              .updateIn(['modelSelection', 'taskType'], field => field.setTouched(true))
              .updateIn(['modelSelection', 'modelType'], field => field.setTouched(true));
            break;
          case ValidationStep.MODEL_CONFIGURATION:
            updatedForm = form
              .updateIn(['modelConfiguration', 'tokenLimit'], field => field.setTouched(true))
              .updateIn(['modelConfiguration', 'repetitionPenalty'], field => field.setTouched(true))
              .updateIn(['modelConfiguration', 'temperature'], field => field.setTouched(true))
              .updateIn(['modelConfiguration', 'topK'], field => field.setTouched(true))
              .updateIn(['modelConfiguration', 'topP'], field => field.setTouched(true));
            break;
          case ValidationStep.DETAILS:
            updatedForm = form.updateIn(['details', 'name'], field => field.setTouched(true));
            break;
          default:
            updatedForm = form.setTouched(true, { recurse: true });
        }
      } else {
        // If no specific step is provided, mark all fields as touched
        updatedForm = form.setTouched(true, { recurse: true });
      }

      setForm(updatedForm);

      if (step) {
        switch (step) {
          case ValidationStep.CONNECTION:
            isValid = validateConnectionStep();
            break;
          case ValidationStep.MODEL_SELECTION:
            isValid = validateModelSelectionStep();
            break;
          case ValidationStep.MODEL_CONFIGURATION:
            isValid = validateModelConfigurationStep();
            break;
          case ValidationStep.DETAILS:
            isValid = validateDetailsStep();
            break;
          default:
            isValid = true;
        }
      } else {
        // If no specific step is provided, validate the entire form
        isValid =
          validateConnectionStep() &&
          validateModelSelectionStep() &&
          validateModelConfigurationStep() &&
          validateDetailsStep();
      }

      if (!isValid) {
        reject();
      } else {
        resolve();
      }
    });
}
