/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { useEffect, useState } from 'react';
import { Item, MapForm } from 'formalistic';

import CreateApplicationApdexForm from 'in-custom-dashboards/widgets/Apdex/components/CreateApdexForm/CreateApplicationApdexForm';
import CreateWebsiteApdexForm from 'in-custom-dashboards/widgets/Apdex/components/CreateApdexForm/CreateWebsiteApdexForm';
import useCreateApdexConfiguration from 'in-custom-dashboards/widgets/Apdex/hooks/useCreateApdexConfiguration';
import { apdexNameKey, createForm } from 'in-custom-dashboards/widgets/Apdex/components/CreateApdexForm/form';
import { ApdexEntityTypes } from 'in-custom-dashboards/widgets/Apdex/apdexTypes';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { getField } from 'in-custom-dashboards/widgets/Apdex/form';
import { ApdexConfiguration, Result } from 'in-types';
import { seconds } from 'in-services/time/time';
import { t } from 'in-i18n';

import locals from './CreateApdexForm.mless';

export interface CreateApdexFormComponentProps extends Omit<CreateApdexFormProps, 'entityType' | 'onClose' | 'onSave'> {
  form: MapForm;
  wasSuccessful?: boolean;
  isSaving?: boolean;
  hasError?: boolean;
  updateForm: (updatedForm: Item) => void;
  onChange: (path: string[], updater: (i: Item) => Item) => void;
  onSubmit: (submittedData: Item) => void;
  onCancel: VoidFunction;
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
  const [form, setForm] = useState<MapForm>(createForm(apdexConfig, entityType, entityId));
  const [{ success, saving, error }, doSubmit] = useCreateApdexConfiguration();

  useEffect(() => {
    // Re-initialize form if apdexConfig has changed
    const newForm = createForm(apdexConfig, entityType, entityId);
    setForm(newForm);
  }, [apdexConfig, entityId, entityType]);

  const CreateApdexFormComponent = entityType === 'application' ? CreateApplicationApdexForm : CreateWebsiteApdexForm;

  const apdexName = getField<string>(form, [apdexNameKey])?.value ?? '';

  const onSaveSuccess = (result: Result<ApdexConfiguration>) => {
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

  const onSaveFailure = () => {
    addMessage(
      {
        type: 'danger',
        timeout: seconds.toMillis(4),
        title: t('in-custom-dashboards:widgets.apdex.createApdexForm.apdexCreateFailedTitle'),
        content: t('in-custom-dashboards:widgets.apdex.createApdexForm.apdexCreateFailedContent', {
          apdexName
        })
      },
      'custom-dashboard-apdex-error'
    );
  };

  return (
    <div className={locals.formWrapper}>
      <CreateApdexFormComponent
        form={form}
        apdexConfig={apdexConfig}
        updateForm={form => setForm(form as MapForm)}
        wasSuccessful={success}
        isSaving={saving}
        hasError={error}
        onSubmit={submittedForm => doSubmit(submittedForm, onSaveSuccess, onSaveFailure)}
        onChange={(path, updater) => setForm(form.updateIn(path, updater))}
        entityId={entityId}
        setFooter={setFooter}
        onCancel={onClose}
      />
    </div>
  );
}
