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
import { UnstableTrackingFunction, useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import SloFormContext from 'in-service-levels/components/ConfigDialog/createSloForm/SloFormContext';
import FormFooter, { CancelButton, SaveButton } from 'in-components/form/FormFooter/FormFooter';
import getTranslatedErrorMessage from 'in-service-levels/components/ConfigDialog/errors';
import { SloForm } from 'in-service-levels/components/ConfigDialog/createSloForm/types';
import { ConfigureDialogMode, SloTrackingMeta } from 'in-service-levels/types';
import { CREATED_OBJECT, UPDATED_OBJECT } from 'in-services/util/constants';
import { close as closeDialog } from 'in-components/DialogPresenter/store';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import useHandleSloForm from 'in-service-levels/hooks/useHandleSloForm';
import { ServiceLevelErrors } from 'in-service-levels/constants';
import Dialog from 'in-components/Dialog/Dialog';
import { seconds } from 'in-services/time/time';
import { t } from 'in-i18n';

import locals from './ConfigureSloDialog.mless';

interface CreateModeProps {
  mode: 'NEW';
  trackingMeta: SloTrackingMeta;
  configuration?: never;
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

type CreateSloDialogProps = CreateModeProps | CloneModeProps | EditModeProps;

export default function ConfigDialog(props: CreateModeProps): JSX.Element;
export default function ConfigDialog(props: CloneModeProps): JSX.Element;
export default function ConfigDialog(props: EditModeProps): JSX.Element;
export default function ConfigDialog({ configuration, mode, trackingMeta }: CreateSloDialogProps): JSX.Element {
  const { form, setForm, updateForm, submitStatus, doSubmit } = useHandleSloForm({ configuration, mode });
  const { trackCta, unstable_trackEvent } = useSegmentTracking();

  useEffect(() => {
    trackCta(
      SLO_CONFIG_DIALOG_OPEN,
      {
        productArea: trackingMeta.productArea,
        pageName: trackingMeta.pageName
      },
      undefined
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onClose = () => {
    trackCta(SLO_CONFIG_DIALOG_CLOSE, {
      productArea: trackingMeta.productArea,
      pageName: trackingMeta.pageName
    });
    closeDialog();
  };

  const onSave = () => {
    updateForm(form.setTouched(true, { recurse: true }));

    if (!form.hierarchyValid) return;

    doSubmit({
      payload: formToSloConfiguration(form, configuration?.id),
      onSuccess: (result: Result<ServiceLevelObjectiveConfiguration>) =>
        onSuccess(mode, result, trackingMeta, unstable_trackEvent),
      onError: (result?: Result<ServiceLevelObjectiveConfiguration>) =>
        onError(mode, trackingMeta, result, unstable_trackEvent)
    });
  };

  const title =
    mode === 'EDIT'
      ? t('in-service-levels:createSloDialog.title.edit')
      : t('in-service-levels:createSloDialog.title.create');

  return (
    <SloFormContext.Provider
      value={{ form, mode, onChange: (path, fn) => updateForm(form.updateIn(path, fn) as SloForm), setForm }}
    >
      <ConfigDialogTimeConfigContextModification>
        <Dialog title={title} onClose={onClose} withoutBodyPadding showOverflow doNotCloseOnOutsideClick>
          <div role="form" className={locals.dialogBody}>
            <SloFormStepsContainer />
          </div>
          <FormFooter>
            <CancelButton onClick={onClose}>{t('in-service-levels:general.cancelButtonLabel')}</CancelButton>
            <SaveButton onClick={onSave} isSaving={submitStatus === 'pending'}>
              {t('in-service-levels:general.saveButtonLabel')}
            </SaveButton>
          </FormFooter>
        </Dialog>
      </ConfigDialogTimeConfigContextModification>
    </SloFormContext.Provider>
  );
}

function onSuccess(
  mode: ConfigureDialogMode,
  { data }: Result<ServiceLevelObjectiveConfiguration>,
  trackingMeta: SloTrackingMeta,
  track: UnstableTrackingFunction
) {
  if (!data) throw Error(ServiceLevelErrors.UNEXPECTED_SLO_CREATION_ERROR);

  const { name, id, entity, indicator, timeWindow } = data;

  addMessage({
    type: 'success',
    timeout: seconds.toMillis(4),
    title: t('in-service-levels:createSloDialog.messages.creationSuccessfulTitle'),
    content: t('in-service-levels:createSloDialog.messages.creationSuccessfulContent', {
      name
    })
  });

  track(
    CREATED_OBJECT,
    { productArea: trackingMeta.productArea, pageName: trackingMeta.pageName, objectType: SLO_CONFIG_DIALOG_FINISH },
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
  mode: ConfigureDialogMode,
  trackingMeta: SloTrackingMeta,
  result: Result<ServiceLevelObjectiveConfiguration> | undefined,
  track: UnstableTrackingFunction
) {
  if (result && result.errors.length !== 0) {
    track(
      UPDATED_OBJECT,
      { productArea: trackingMeta.productArea, pageName: trackingMeta.pageName, objectType: SLO_CONFIG_DIALOG_ERROR },
      {
        mode,
        code: 'API_ERROR'
      }
    );

    return result.errors.forEach(error =>
      addMessage({
        ...errorMessageHeader,
        type: 'danger',
        timeout: seconds.toMillis(6),
        content: getTranslatedErrorMessage(error)
      })
    );
  }

  if (!result?.data) {
    track(
      UPDATED_OBJECT,
      {
        productArea: trackingMeta.productArea,
        pageName: trackingMeta.pageName,
        objectType: SLO_CONFIG_DIALOG_ERROR
      },
      {
        mode,
        code: 'UNEXPECTED_ERROR'
      }
    );

    return addMessage({
      ...errorMessageHeader,
      type: 'danger',
      timeout: seconds.toMillis(6),
      content: t('in-service-levels:createSloDialog.messages.creationFailedUnexpectedContent')
    });
  }

  const { name } = result.data;

  track(
    UPDATED_OBJECT,
    {
      productArea: trackingMeta.productArea,
      pageName: trackingMeta.pageName,
      objectType: SLO_CONFIG_DIALOG_ERROR
    },
    {
      mode,
      code: 'INVALID_SLO_CONFIG'
    }
  );

  return addMessage({
    ...errorMessageHeader,
    type: 'danger',
    timeout: seconds.toMillis(6),
    content: t('in-service-levels:createSloDialog.messages.creationFailedContent', {
      name
    })
  });
}
