/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { useState, useEffect } from 'react';

import type { Observable } from '@instana/observables';
import type { Error } from '@instana/types';

import type { GatewayFormSideEffectsReturnType } from 'in-aihub/GatewaysCatalogComponents/CreateGatewayTearsheet/hooks/useGatewayFormSideEffects';
import type {
  GatewayForm,
  GatewayPayload
} from 'in-aihub/GatewaysCatalogComponents/CreateGatewayTearsheet/types/gatewayFormTypes';
import useGatewayFormSideEffects from 'in-aihub/GatewaysCatalogComponents/CreateGatewayTearsheet/hooks/useGatewayFormSideEffects';
import { createGatewayForm } from 'in-aihub/GatewaysCatalogComponents/CreateGatewayTearsheet/utils/formUtils';
import type { Gateway } from 'in-aihub/GatewaysCatalogComponents/useGatewaysData';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { CREATE_GATEWAY, EDIT_GATEWAY } from 'in-aihub/constants/eventNames';
import type { DoSubmitFunction } from 'in-hooks/useFormSubmission';
import useFormSubmission from 'in-hooks/useFormSubmission';
import { createGateway, editGateway } from 'in-aihub/api';
import type { FetchStatus } from 'in-hooks/utils/types';

type GatewayFormSubmissionAction = (gateway: GatewayPayload, id?: string) => Observable<any>;

interface UseHandleGatewayFormProps {
  mode: 'NEW' | 'EDIT';
  gateway?: GatewayPayload | Gateway;
  gatewayId?: string;
}

interface UseHandleGatewayFormReturn {
  form: GatewayForm;
  setForm: React.Dispatch<React.SetStateAction<GatewayForm>>;
  updateForm: GatewayFormSideEffectsReturnType;
  submitStatus: FetchStatus | undefined;
  doSubmit: DoSubmitFunction<GatewayPayload, any>;
  resetForm: () => void;
  errors: Error[] | undefined;
}

export default function useHandleGatewayForm({
  mode,
  gateway,
  gatewayId
}: UseHandleGatewayFormProps): UseHandleGatewayFormReturn {
  const createForm = () => createGatewayForm({ gateway });
  const [form, setForm] = useState(createForm());
  const updateForm = useGatewayFormSideEffects(form, setForm);
  const [submitStatus, doSubmit] = useFormSubmission(getFormSubmitAction(mode, gatewayId));
  const [errors, setErrors] = useState<Error[] | undefined>(undefined);
  const { trackCta } = useSegmentTracking();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (errors && errors.length > 0) setErrors(undefined);
    }, 6000);

    return () => clearTimeout(timeoutId);
  }, [errors]);

  return {
    form,
    setForm,
    updateForm,
    submitStatus,
    doSubmit: ({ payload, onError, onSuccess }) => {
      doSubmit({
        payload,
        onSuccess: result => {
          // Track the event based on the mode
          if (mode === 'NEW') {
            trackCta(CREATE_GATEWAY, {
              gatewayName: payload.name,
              aiModel: payload.aiModel,
              capabilities: payload.supports?.capabilities
            });
          } else if (mode === 'EDIT') {
            trackCta(EDIT_GATEWAY, {
              gatewayId,
              gatewayName: payload.name,
              aiModel: payload.aiModel,
              capabilities: payload.supports?.capabilities
            });
          }

          if (onSuccess) {
            onSuccess(result);
          }
        },
        onError: result => {
          setErrors(result?.errors);
          if (onError) {
            onError(result);
          }
        }
      });
    },
    resetForm: () => setForm(createForm()),
    errors
  };
}

function getFormSubmitAction(mode: 'NEW' | 'EDIT', gatewayId?: string): GatewayFormSubmissionAction {
  if (mode === 'EDIT' && gatewayId) {
    return (payload: GatewayPayload) => editGateway({ ...payload, id: gatewayId }, gatewayId);
  }
  return createGateway;
}
