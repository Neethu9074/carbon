/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { Item, MapForm } from 'formalistic';
import React from 'react';

import { ApdexConfiguration, Result } from '@instana/types';

import CreateApplicationApdexForm from 'in-custom-dashboards/widgets/Apdex/components/CreateApdexForm/CreateApplicationApdexForm';
import {
  apdexNameKey,
  toApdexConfigurationInput
} from 'in-custom-dashboards/widgets/Apdex/components/CreateApdexForm/form';
import CreateWebsiteApdexForm from 'in-custom-dashboards/widgets/Apdex/components/CreateApdexForm/CreateWebsiteApdexForm';
// eslint-disable-next-line import/no-deprecated
import { getField } from 'in-custom-dashboards/widgets/SloLegacy/form';
import { APDEX_MANAGEMENT_CREATE_FINISH, APDEX_MANAGEMENT_EDIT_FINISH } from 'in-services/tracking/eventNames';
import useCreateApdexForm from 'in-custom-dashboards/widgets/Apdex/hooks/useCreateApdexForm';
import getTranslatedErrorMessage from 'in-service-levels/components/ConfigDialog/errors';
import { createApdexConfiguration } from 'in-custom-dashboards/widgets/Apdex/api';
import { ApdexEntityTypes } from 'in-custom-dashboards/widgets/Apdex/apdexTypes';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { CREATED_OBJECT, UPDATED_OBJECT } from 'in-services/util/constants';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import useFormSubmission from 'in-hooks/useFormSubmission';
import { seconds } from 'in-services/time/time';
import { t } from 'in-i18n';

import locals from './CreateApdexForm.mless';

export interface CreateApdexFormComponentProps
  extends Omit<CreateApdexFormProps, 'entityType' | 'onClose' | 'onSave' | 'entityId' | 'apdexConfig'> {
  form: MapForm<any>;
  wasSuccessful?: boolean;
  isSaving?: boolean;
  hasError?: boolean;
  onChange: (path: string[], updater: (i: Item) => Item) => void;
  onSubmit: (submittedData: Item) => void;
  onCancel: VoidFunction;
  isEditing: boolean;
}

interface CreateApdexFormProps {
  apdexConfig: Partial<ApdexConfiguration>;
  entityType: ApdexEntityTypes;
  entityId: string;
  setFooter: (footer: React.ReactNode) => void;
  onClose: VoidFunction;
  onSave: (item: ApdexConfiguration) => void;
}

export default function CreateApdexForm({
  apdexConfig,
  entityType,
  entityId,
  setFooter,
  onClose,
  onSave
}: CreateApdexFormProps) {
  const [form, setForm] = useCreateApdexForm(apdexConfig, entityType, entityId);
  const [submitStatus, doSubmit] = useFormSubmission(createApdexConfiguration);

  const { unstable_trackEvent } = useSegmentTracking();

  const isEditing = Boolean(apdexConfig.id);

  const CreateApdexFormComponent = entityType === 'application' ? CreateApplicationApdexForm : CreateWebsiteApdexForm;

  // eslint-disable-next-line import/no-deprecated
  const apdexName = getField<string>(form, [apdexNameKey])?.value ?? '';

  const onSubmit = (submittedForm: Item) => {
    setForm(form.setTouched(true));
    doSubmit({ payload: toApdexConfigurationInput(submittedForm), onSuccess: onSaveSuccess, onError: onSaveFailure });
  };

  const onSaveSuccess = (result: Result<ApdexConfiguration>) => {
    const eventType = isEditing ? UPDATED_OBJECT : CREATED_OBJECT;
    const objectType = isEditing ? APDEX_MANAGEMENT_EDIT_FINISH : APDEX_MANAGEMENT_CREATE_FINISH;

    unstable_trackEvent(eventType, { entityType, objectType });
    addMessage(
      {
        type: 'info',
        timeout: seconds.toMillis(4),
        title: t('in-custom-dashboards:widgets.apdex.createApdexForm.apdexCreateSuccessTitle'),
        content: t('in-custom-dashboards:widgets.apdex.createApdexForm.apdexCreateSuccessContent', {
          apdexName
        })
      },
      'custom-dashboard-apdex'
    );
    onSave(result.data!);
    onClose();
  };

  const onSaveFailure = (result?: Result<ApdexConfiguration>) => {
    const messageParams = {
      type: 'danger',
      title: t('in-custom-dashboards:widgets.apdex.createApdexForm.apdexCreateFailedTitle')
    } as const;

    if (result?.errors && result.errors.length !== 0) {
      return result.errors.forEach(error =>
        addMessage({
          ...messageParams,
          timeout: seconds.toMillis(6),
          content: getTranslatedErrorMessage(error)
        })
      );
    }

    return addMessage({
      ...messageParams,
      timeout: seconds.toMillis(6),
      content: t('in-custom-dashboards:widgets.apdex.createApdexForm.apdexCreateFailedContent', {
        apdexName
      })
    });
  };

  return (
    <div className={locals.formWrapper}>
      <CreateApdexFormComponent
        form={form}
        wasSuccessful={submitStatus === 'resolved'}
        isSaving={submitStatus === 'pending'}
        hasError={submitStatus === 'rejected'}
        onSubmit={onSubmit}
        // @ts-expect-error Formalistic v2 expects number indices for ListForms, v1 used strings. Strings are still supported
        onChange={(path, updater) => setForm(form.updateIn(path, updater))}
        setFooter={setFooter}
        onCancel={onClose}
        isEditing={isEditing}
      />
    </div>
  );
}
