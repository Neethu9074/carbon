/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useEffect } from 'react';

import { Result, ServiceLevelObjectiveConfiguration } from '@instana/types';

import ConfigDialogTimeConfigContextModification from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloScopeSection/ConfigDialogTimeConfigContextModification';
import {
  SLO_CONFIG_DIALOG_CLOSE,
  SLO_CONFIG_DIALOG_ERROR,
  SLO_CONFIG_DIALOG_FINISH,
  SLO_CONFIG_DIALOG_OPEN
} from 'in-services/tracking/eventNames';
import SloFormStepsContainer from 'in-service-levels/components/ConfigDialog/components/SloFormStepsContainer';
import { formToSloConfiguration } from 'in-service-levels/components/ConfigDialog/createSloForm/utils';
import { CreateSloDialogMode, SloForm } from 'in-service-levels/components/ConfigDialog/createSloForm';
import SloFormContext from 'in-service-levels/components/ConfigDialog/createSloForm/SloFormContext';
import useHandleSloForm, { UseHandleSloFormProps } from 'in-service-levels/hooks/useHandleSloForm';
import { SloTrackingMeta, trackSloEvent } from 'in-service-levels/hooks/SloTrackerProvider';
import getTranslatedErrorMessage from 'in-service-levels/components/ConfigDialog/errors';
import { close as closeDialog } from 'in-components/DialogPresenter/store';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import ConfigDialog from 'in-service-levels/components/ConfigDialog';
import { ServiceLevelErrors } from 'in-service-levels/constants';
import { seconds } from 'in-services/time/time';
import { t } from 'in-i18n';

interface CreateSloDialogProps extends UseHandleSloFormProps {
  trackingMeta: SloTrackingMeta;
}

interface CreateModeProps {
  mode: 'NEW';
  trackingMeta: SloTrackingMeta;
}

interface CloneModeProps {
  mode: 'CLONE';
  configuration: ServiceLevelObjectiveConfiguration;
  trackingMeta: SloTrackingMeta;
}

interface EditModeProps {
  mode: 'EDIT';
  configuration: ServiceLevelObjectiveConfiguration;
  trackingMeta: SloTrackingMeta;
}

export default function CreateSloDialog(props: CreateModeProps): JSX.Element;
export default function CreateSloDialog(props: CloneModeProps): JSX.Element;
export default function CreateSloDialog(props: EditModeProps): JSX.Element;
export default function CreateSloDialog({ configuration, mode, trackingMeta }: CreateSloDialogProps): JSX.Element {
  const { form, setForm, updateForm, submitStatus, doSubmit } = useHandleSloForm({ configuration, mode });

  useEffect(() => {
    trackSloEvent(
      SLO_CONFIG_DIALOG_OPEN,
      {
        productArea: trackingMeta.productArea,
        pageName: trackingMeta.pageName
      },
      undefined
    );
  }, [trackingMeta]);

  const title =
    mode === 'EDIT'
      ? t('in-service-levels:createSloDialog.title.edit')
      : t('in-service-levels:createSloDialog.title.create');
  return (
    <SloFormContext.Provider
      value={{ form, mode, onChange: (path, fn) => updateForm(form.updateIn(path, fn) as SloForm), setForm }}
    >
      <ConfigDialogTimeConfigContextModification>
        <ConfigDialog
          title={title}
          onClose={() => {
            trackSloEvent(
              SLO_CONFIG_DIALOG_CLOSE,
              {
                productArea: trackingMeta.productArea,
                pageName: trackingMeta.pageName
              },
              undefined
            );
            closeDialog();
          }}
          isSaving={submitStatus === 'pending'}
          onSave={() => {
            updateForm(form.setTouched(true, { recurse: true }));

            if (!form.hierarchyValid) return;

            doSubmit({
              payload: formToSloConfiguration(form, configuration?.id),
              onSuccess: (result: Result<ServiceLevelObjectiveConfiguration>) => onSuccess(mode, result, trackingMeta),
              onError: (result?: Result<ServiceLevelObjectiveConfiguration>) => onError(mode, trackingMeta, result)
            });
          }}
        >
          <SloFormStepsContainer />
        </ConfigDialog>
      </ConfigDialogTimeConfigContextModification>
    </SloFormContext.Provider>
  );
}

function onSuccess(
  mode: CreateSloDialogMode,
  { data }: Result<ServiceLevelObjectiveConfiguration>,
  trackingMeta: SloTrackingMeta
) {
  if (!data) throw Error(ServiceLevelErrors.UNEXPECTED_SLO_CREATION_ERROR);

  const { name, id, entity, indicator, timeWindow } = data;

  addMessage({
    type: 'info',
    timeout: seconds.toMillis(4),
    title: t('in-service-levels:createSloDialog.messages.creationSuccessfulTitle'),
    content: t('in-service-levels:createSloDialog.messages.creationSuccessfulContent', {
      name
    })
  });

  trackSloEvent(
    SLO_CONFIG_DIALOG_FINISH,
    { productArea: trackingMeta.productArea, pageName: trackingMeta.pageName },
    {
      id,
      mode,
      blueprint: indicator.blueprint,
      indicatorType: indicator.type,
      entityType: entity.type,
      timeWindowType: timeWindow.type
    }
  );

  closeDialog();
}

const errorMessageHeader = {
  type: 'danger',
  title: t('in-service-levels:createSloDialog.messages.creationFailedTitle')
} as const;

function onError(
  mode: CreateSloDialogMode,
  trackingMeta: SloTrackingMeta,
  result?: Result<ServiceLevelObjectiveConfiguration>
) {
  if (result && result.errors.length !== 0) {
    trackSloEvent(
      SLO_CONFIG_DIALOG_ERROR,
      { productArea: trackingMeta.productArea, pageName: trackingMeta.pageName },
      {
        mode,
        code: 'API_ERROR'
      }
    );

    return result.errors.forEach(error =>
      addMessage({
        ...errorMessageHeader,
        timeout: seconds.toMillis(6),
        content: getTranslatedErrorMessage(error)
      })
    );
  }

  if (!result?.data) {
    trackSloEvent(
      SLO_CONFIG_DIALOG_ERROR,
      {
        productArea: trackingMeta.productArea,
        pageName: trackingMeta.pageName
      },
      {
        mode,
        code: 'UNEXPECTED_ERROR'
      }
    );

    return addMessage({
      ...errorMessageHeader,
      timeout: seconds.toMillis(6),
      content: t('in-service-levels:createSloDialog.messages.creationFailedUnexpectedContent')
    });
  }

  const { name } = result.data;

  trackSloEvent(
    SLO_CONFIG_DIALOG_ERROR,
    {
      productArea: trackingMeta.productArea,
      pageName: trackingMeta.pageName
    },
    {
      mode,
      code: 'INVALID_SLO_CONFIG'
    }
  );

  return addMessage({
    ...errorMessageHeader,
    timeout: seconds.toMillis(6),
    content: t('in-service-levels:createSloDialog.messages.creationFailedContent', {
      name
    })
  });
}
