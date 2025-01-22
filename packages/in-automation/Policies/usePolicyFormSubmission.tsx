/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Policy, Action } from '@instana/types';

import { getPolicyActionFromActions, getPolicyTriggerFromTriggers } from 'in-automation/utils/policy';
import usePolicyDetailsUrlParams from 'in-automation/Policies/usePolicyDetailsUrlParams';
import { getPolicyFromForm } from 'in-automation/Policies/usePolicyForm/utils';
import { PolicyForm } from 'in-automation/Policies/usePolicyForm/types';
import { isAutomatic, isManual } from 'in-automation/utils/policy';
import { saveNewPolicy, savePolicy } from 'in-automation/api';
import { isAIActionCopy } from 'in-automation/utils/action';
import useFormSubmission from 'in-hooks/useFormSubmission';
import { useSegmentTracker } from 'in-automation/tracker';
import { Triggers } from 'in-automation/types';

interface SubmitPayload {
  form: PolicyForm;
  triggers: Triggers;
  actions: Action[];
}

export default function usePolicyFormSubmission() {
  const { createPolicyTrackerSegment, editPolicyTrackerSegment } = useSegmentTracker();
  const { id, isNew } = usePolicyDetailsUrlParams();

  return useFormSubmission<SubmitPayload, Policy>(({ form, triggers, actions }) => {
    const policy = getPolicyFromForm(form);
    const selectedAction = getPolicyActionFromActions(actions, policy)!;
    const trigger = getPolicyTriggerFromTriggers(triggers, policy);
    const trackerDetails = {
      actionName: selectedAction.name,
      actionType: selectedAction.type,
      policyName: policy.name,
      policyType: isManual(policy) && isAutomatic(policy) ? 'both' : isManual(policy) ? 'manual' : 'automatic',
      aiOriginated: isAIActionCopy(selectedAction) ? true : false,
      triggerName: trigger?.name
    };

    if (isNew) {
      createPolicyTrackerSegment(trackerDetails);

      return saveNewPolicy(policy);
    } else {
      editPolicyTrackerSegment(trackerDetails);

      return savePolicy(policy, id!);
    }
  });
}
