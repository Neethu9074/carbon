/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Action } from '@instana/types';

import { aiOriginatedMetadata, isAIAction, isAIActionCopy } from 'in-automation/utils/action';
import useActionDetailsUrlParams from 'in-automation/ActionCatalog/useActionDetailsUrlParams';
import { getActionFromForm } from 'in-automation/ActionCatalog/useActionForm/utils';
import { ActionForm } from 'in-automation/ActionCatalog/useActionForm/types';
import { ActionFormEntity } from 'in-automation/ActionCatalog/types';
import { saveAction, saveNewAction } from 'in-automation/api';
import useFormSubmission from 'in-hooks/useFormSubmission';
import { useSegmentTracker } from 'in-automation/tracker';

interface SubmitPayload {
  form: ActionForm;
  action?: ActionFormEntity;
}

export default function useActionFormSubmission() {
  const { createActionTrackerSegment, editActionTrackerSegment } = useSegmentTracker();
  const { id, isNew, isCopy } = useActionDetailsUrlParams();

  return useFormSubmission<SubmitPayload, Action>(({ form, action }) => {
    const actionSpecification = getActionFromForm(form, action);
    const aiOriginated = action && (isAIAction(action) || isAIActionCopy(action)) ? true : false;
    const trackerDetails = {
      actionName: actionSpecification.name,
      actionType: actionSpecification.type,
      aiOriginated
    };

    if (isNew) {
      createActionTrackerSegment(trackerDetails);

      return saveNewAction({
        ...actionSpecification,
        metadata: aiOriginated && isCopy ? aiOriginatedMetadata : undefined
      });
    } else {
      editActionTrackerSegment(trackerDetails);

      return saveAction(actionSpecification, id!);
    }
  });
}
