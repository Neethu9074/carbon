/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { createField, createMapForm, ValidationResult } from 'formalistic';

import type {
  GatewayForm,
  GatewayPayload
} from 'in-aihub/GatewaysCatalogComponents/CreateGatewayTearsheet/types/gatewayFormTypes';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { positiveNumberValidator } from 'in-services/validators/number';
import { notBlankValidator } from 'in-services/validators/string';
import { t } from 'in-i18n';

//import type { GatewayPayload } from 'in-aihub/GatewaysCatalogComponents/CreateGatewayTearsheet/types/gatewayFormTypes';

interface CreateGatewayFormParams {
  form?: GatewayForm;
  gateway?: GatewayPayload;
}

function urlValidator(string: string): ValidationResult {
  try {
    new URL(string);
    return null;
  } catch (err) {
    return [
      {
        severity: 'error',
        message: t('in-aihub:gateways.createGateway.connectionSection.validURL')
      }
    ];
  }
}

/**
 * Creates a gateway form based on the provided parameters
 */
export function createGatewayForm({ gateway, form }: CreateGatewayFormParams): GatewayForm {
  if (form) return createGatewayFormFromForm(form);
  if (gateway) return createGatewayFormFromGateway(gateway);
  return createDefaultGatewayForm();
}

/**
 * Creates the initial form state for the gateway creation
 */
export function createDefaultGatewayForm(): GatewayForm {
  //@ts-ignore
  return createMapForm({
    items: {
      connection: createMapForm({
        items: {
          agentType: createField({
            value: 'IBM watsonx',
            validator: notBlankValidator
          }),
          watsonxKey: createField({
            value: '',
            validator: notBlankValidator
          }),
          watsonxProject: createField({
            value: '',
            validator: notBlankValidator
          }),
          watsonxUrl: createField({
            value: '',
            validator: composeAndShortCircuitOnError(notBlankValidator, urlValidator)
          }),
          endpointUrl: createField({
            value: '',
            validator: composeAndShortCircuitOnError(notBlankValidator, urlValidator)
          }),
          endpointApiKey: createField({
            value: '',
            validator: notBlankValidator
          })
        }
      }),
      modelSelection: createMapForm({
        items: {
          taskType: createField({
            value: 'manual_action_generation',
            validator: notBlankValidator
          }),
          modelType: createField({
            value: 'ibm/granite-3-3-8b-instruct',
            validator: notBlankValidator
          })
        }
      }),
      modelConfiguration: createMapForm({
        items: {
          tokenLimit: createField({
            value: 100,
            validator: positiveNumberValidator
          }),
          maxLatency: createField({
            value: 1,
            validator: positiveNumberValidator
          }),
          repetitionPenalty: createField({
            value: 1,
            validator: positiveNumberValidator
          }),
          temperature: createField({
            value: 1,
            validator: positiveNumberValidator
          }),
          topK: createField({
            value: 50,
            validator: positiveNumberValidator
          }),
          topP: createField({
            value: 0.5,
            validator: positiveNumberValidator
          })
        }
      }),
      details: createMapForm({
        items: {
          name: createField({
            value: '',
            validator: notBlankValidator
          }),
          description: createField({
            value: ''
          })
        }
      })
    }
  });
}

/**
 * Creates a form from an existing gateway
 */
function createGatewayFormFromGateway(gateway: any): GatewayForm {
  return createMapForm({
    items: {
      connection: createMapForm({
        items: {
          agentType: createField<string>({
            value: gateway.type || 'IBM watsonx',
            validator: notBlankValidator
          }),
          watsonxKey: createField<string>({
            value: gateway.watsonxKey || '',
            validator: notBlankValidator
          }),
          watsonxProject: createField<string>({
            value: gateway.watsonxProject || '',
            validator: notBlankValidator
          }),
          watsonxUrl: createField<string>({
            value: gateway.watsonxUrl || '',
            validator: composeAndShortCircuitOnError(notBlankValidator, urlValidator)
          }),
          endpointUrl: createField<string>({
            value: gateway.endpointUrl || '',
            validator: composeAndShortCircuitOnError(notBlankValidator, urlValidator)
          }),
          endpointApiKey: createField<string>({
            value: gateway.endpointApiKey || '',
            validator: notBlankValidator
          })
        }
      }),
      modelSelection: createMapForm({
        items: {
          taskType: createField<string>({
            value: gateway.taskType || 'manual_action_generation',
            validator: notBlankValidator
          }),
          modelType: createField<string>({
            value: gateway.aiModel || 'ibm/granite-3-3-8b-instruct',
            validator: notBlankValidator
          })
        }
      }),
      modelConfiguration: createMapForm({
        items: {
          tokenLimit: createField<number>({
            value: gateway.configurations?.tokenLimit || 100,
            validator: positiveNumberValidator
          }),
          maxLatency: createField<number>({
            value: gateway.configurations?.maxLatency || 1
          }),
          repetitionPenalty: createField<number>({
            value: gateway.configurations?.repetitionPenalty || 1,
            validator: positiveNumberValidator
          }),
          temperature: createField<number>({
            value: gateway.configurations?.temperature || 1,
            validator: positiveNumberValidator
          }),
          topK: createField<number>({
            value: gateway.configurations?.topK || 50,
            validator: positiveNumberValidator
          }),
          topP: createField<number>({
            value: gateway.configurations?.topP || 0.5,
            validator: positiveNumberValidator
          })
        }
      }),
      details: createMapForm({
        items: {
          name: createField<string>({
            value: gateway.name || '',
            validator: notBlankValidator
          }),
          description: createField<string>({
            value: gateway.description || ''
          })
        }
      })
    }
  });
}

/**
 * Creates a form from an existing form state
 */
function createGatewayFormFromForm(form: GatewayForm): GatewayForm {
  const connection = form.get('connection');
  const modelSelection = form.get('modelSelection');
  const modelConfiguration = form.get('modelConfiguration');
  const details = form.get('details');

  return createMapForm({
    items: {
      connection: createMapForm({
        items: {
          agentType: createField<string>({
            value: connection.get('agentType').value,
            validator: notBlankValidator,
            touched: connection.get('agentType').touched
          }),
          watsonxKey: createField<string>({
            value: connection.get('watsonxKey').value,
            validator: notBlankValidator,
            touched: connection.get('watsonxKey').touched
          }),
          watsonxProject: createField<string>({
            value: connection.get('watsonxProject').value,
            validator: notBlankValidator,
            touched: connection.get('watsonxProject').touched
          }),
          watsonxUrl: createField<string>({
            value: connection.get('watsonxUrl').value,
            validator: composeAndShortCircuitOnError(notBlankValidator, urlValidator),
            touched: connection.get('watsonxUrl').touched
          }),
          endpointUrl: createField<string>({
            value: connection.get('endpointUrl').value,
            validator: composeAndShortCircuitOnError(notBlankValidator, urlValidator),
            touched: connection.get('endpointUrl').touched
          }),
          endpointApiKey: createField<string>({
            value: connection.get('endpointApiKey').value,
            validator: notBlankValidator,
            touched: connection.get('endpointApiKey').touched
          })
        }
      }),
      modelSelection: createMapForm({
        items: {
          taskType: createField<string>({
            value: modelSelection.get('taskType').value,
            validator: notBlankValidator,
            touched: modelSelection.get('taskType').touched
          }),
          modelType: createField<string>({
            value: modelSelection.get('modelType').value,
            validator: notBlankValidator,
            touched: modelSelection.get('modelType').touched
          })
        }
      }),
      modelConfiguration: createMapForm({
        items: {
          tokenLimit: createField<number>({
            value: modelConfiguration.get('tokenLimit').value,
            validator: positiveNumberValidator,
            touched: modelConfiguration.get('tokenLimit').touched
          }),
          maxLatency: createField<number>({
            value: modelConfiguration.get('maxLatency').value,
            touched: modelConfiguration.get('maxLatency').touched
          }),
          repetitionPenalty: createField<number>({
            value: modelConfiguration.get('repetitionPenalty').value,
            validator: positiveNumberValidator,
            touched: modelConfiguration.get('repetitionPenalty').touched
          }),
          temperature: createField<number>({
            value: modelConfiguration.get('temperature').value,
            validator: positiveNumberValidator,
            touched: modelConfiguration.get('temperature').touched
          }),
          topK: createField<number>({
            value: modelConfiguration.get('topK').value,
            validator: positiveNumberValidator,
            touched: modelConfiguration.get('topK').touched
          }),
          topP: createField<number>({
            value: modelConfiguration.get('topP').value,
            validator: positiveNumberValidator,
            touched: modelConfiguration.get('topP').touched
          })
        }
      }),
      details: createMapForm({
        items: {
          name: createField<string>({
            value: details.get('name').value,
            validator: notBlankValidator,
            touched: details.get('name').touched
          }),
          description: createField<string>({
            value: details.get('description').value,
            touched: details.get('description').touched
          })
        }
      })
    }
  });
}

/**
 * Converts the form data to a gateway payload for API submission
 */
export function formToGateway(form: GatewayForm): GatewayPayload {
  const connection = form.get('connection');
  const modelSelection = form.get('modelSelection');
  const modelConfiguration = form.get('modelConfiguration');
  const details = form.get('details');

  const isWatsonx = connection.get('agentType').value === 'IBM watsonx';

  return {
    name: details.get('name').value,
    description: details.get('description').value,
    aiModel: modelSelection.get('modelType').value,
    watsonxKey: isWatsonx ? connection.get('watsonxKey').value : undefined,
    watsonxProject: isWatsonx ? connection.get('watsonxProject').value : undefined,
    watsonxUrl: isWatsonx ? connection.get('watsonxUrl').value : undefined,
    endpointUrl: !isWatsonx ? connection.get('endpointUrl').value : undefined,
    endpointApiKey: connection.get('endpointApiKey').value,
    //fix
    supports: {
      capabilities: [modelSelection.get('taskType').value]
    },
    metadata: {
      source: 'user',
      version: '1.0.0'
    },
    configurations: {
      tokenLimit: modelConfiguration.get('tokenLimit').value,
      maxLatency: modelConfiguration.get('maxLatency').value,
      repetitionPenalty: modelConfiguration.get('repetitionPenalty').value,
      temperature: modelConfiguration.get('temperature').value,
      topK: modelConfiguration.get('topK').value,
      topP: modelConfiguration.get('topP').value
    }
  };
}

/**
 * Validates if a field is valid (no errors and has been touched)
 */
export function isFieldValid(field: any): boolean {
  // If the field hasn't been touched yet, consider it valid
  // This prevents showing validation errors when the form first opens
  if (!field.touched) {
    return true;
  }
  // Otherwise, check if the field is valid
  return field.valid;
}
