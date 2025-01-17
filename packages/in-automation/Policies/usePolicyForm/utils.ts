/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { PolicyForm } from 'in-automation/Policies/usePolicyForm/types';
import { SCOPE } from 'in-automation/Policies/usePolicyForm/constants';
import { NewPolicy, NewTypeConfiguration } from 'in-automation/types';
import { POLICY_TYPE } from 'in-automation/constants';

export function getPolicyFromForm(form: PolicyForm) {
  const policySpecification: NewPolicy = {
    name: form.get('name').value,
    description: form.get('description').value,
    tags: form.get('tags').value,
    trigger: {
      type: form.get('triggerType').value,
      id: form.get('triggerId').value
    },
    typeConfigurations: [] as NewTypeConfiguration[]
  };

  const query = form.get('scope').get('applyOn').value === SCOPE.ALL ? undefined : form.get('scope').get('query').value;

  const action = form.get('action');
  const typeConfiguration = {
    condition: {
      query
    },
    runnable: {
      id: action.get('actionId').value,
      type: 'action' as const,
      runConfiguration: {
        actions: [
          {
            action: { id: action.get('actionId').value },
            agentId: action.get('agentId').value,
            inputParameterValues: action.get('parameters').value
          }
        ]
      }
    }
  };

  if (action.get('type').get('manual').value) {
    policySpecification.typeConfigurations.push({
      name: POLICY_TYPE.MANUAL,
      ...typeConfiguration
    });
  }

  if (action.get('type').get('automatic').value) {
    policySpecification.typeConfigurations.push({
      name: POLICY_TYPE.AUTOMATIC,
      ...typeConfiguration
    });
  }

  return policySpecification;
}
