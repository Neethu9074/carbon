/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useCallback } from 'react';

import { CreateTearsheet } from '@instana/ibm-products';
import type { Result } from '@instana/types';

import ModelConfigurationSection from 'in-aihub/GatewaysCatalogComponents/CreateGatewayTearsheet/components/ModelConfigurationSection';
import ModelSelectionSection from 'in-aihub/GatewaysCatalogComponents/CreateGatewayTearsheet/components/ModelSelectionSection';
import useHandleGatewayForm from 'in-aihub/GatewaysCatalogComponents/CreateGatewayTearsheet/hooks/useHandleGatewayForm';
import ConnectionSection from 'in-aihub/GatewaysCatalogComponents/CreateGatewayTearsheet/components/ConnectionSection';
import type { GatewayPayload } from 'in-aihub/GatewaysCatalogComponents/CreateGatewayTearsheet/types/gatewayFormTypes';
import GatewayFormContext from 'in-aihub/GatewaysCatalogComponents/CreateGatewayTearsheet/context/GatewayFormContext';
import DetailsSection from 'in-aihub/GatewaysCatalogComponents/CreateGatewayTearsheet/components/DetailsSection';
import { formToGateway } from 'in-aihub/GatewaysCatalogComponents/CreateGatewayTearsheet/utils/formUtils';
import { refreshGatewaysData } from 'in-aihub/GatewaysCatalogComponents/useGatewaysData';
import type { Gateway } from 'in-aihub/GatewaysCatalogComponents/useGatewaysData';
import { close as closeDialog } from 'in-components/DialogPresenter/store';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { seconds } from 'in-services/time/time';
import { t } from 'in-i18n';

import locals from 'in-aihub/GatewaysCatalogComponents/CreateGatewayTearsheet/CreateGatewayTearsheet.mless';

interface CreateGatewayTearsheetProps {
  mode: 'NEW' | 'EDIT';
  gatewayId?: string;
  gateway?: Gateway | GatewayPayload;
}

export default function CreateGatewayTearsheet({ mode, gatewayId, gateway }: CreateGatewayTearsheetProps) {
  const { form, setForm, updateForm, submitStatus, doSubmit, errors } = useHandleGatewayForm({
    mode,
    gateway,
    gatewayId
  });

  const isEditMode = mode === 'EDIT';

  const onClose = () => {
    closeDialog();
  };

  const onRequestSubmit = () =>
    new Promise<void>((resolve, reject) => {
      doSubmit({
        payload: formToGateway(form),
        onSuccess: result => {
          resolve();
          onSuccess(result, isEditMode);
        },
        onError: result => {
          reject();
          onError(result);
        }
      });
    });

  // Use useCallback to prevent infinite re-renders
  const handleFormChange = useCallback(
    (path: any, fn: any) => {
      // @ts-ignore - Ignoring type issues with form updates
      updateForm(form.updateIn(path, fn));
    },
    [form, updateForm]
  );

  return (
    <GatewayFormContext.Provider
      value={{
        form,
        mode,
        onChange: handleFormChange,
        setForm,
        updateForm
      }}
    >
      <CreateTearsheet
        open
        className={locals['create-gateway']}
        title={
          isEditMode ? (
            <div className={locals.title}>
              {t('in-aihub:gateways.createGateway.editTitle', { entityName: gateway?.name ?? '' })}
            </div>
          ) : (
            t('in-aihub:gateways.createGateway.title')
          )
        }
        submitButtonText={isEditMode ? t('in-aihub:general.saveButtonLabel') : t('in-aihub:general.createButtonLabel')}
        cancelButtonText={t('in-aihub:general.cancelButtonLabel')}
        backButtonText={t('in-aihub:general.backButtonLabel')}
        nextButtonText={t('in-aihub:general.nextButtonLabel')}
        onRequestSubmit={onRequestSubmit}
        onClose={onClose}
      >
        <ConnectionSection />
        <ModelSelectionSection />
        <ModelConfigurationSection />
        <DetailsSection submitStatus={submitStatus} errors={errors} />
      </CreateTearsheet>
    </GatewayFormContext.Provider>
  );
}

function onSuccess(result: Result<any>, isEditMode: boolean) {
  if (!result?.data) throw Error('Unexpected gateway operation error');

  const { name } = result.data;
  addMessage({
    type: 'success',
    timeout: seconds.toMillis(4),
    title: isEditMode
      ? t('in-aihub:gateways.editGateway.messages.success.title')
      : t('in-aihub:gateways.createGateway.messages.successfulTitle'),
    content: isEditMode
      ? t('in-aihub:gateways.editGateway.messages.success.content', { name })
      : t('in-aihub:gateways.createGateway.messages.successfulContent', { name })
  });
  // Refresh the gateways data
  refreshGatewaysData();
  closeDialog();
}

function onError(result: Result<any> | undefined) {
  if (result && result.errors.length !== 0) {
    return;
  }
}
