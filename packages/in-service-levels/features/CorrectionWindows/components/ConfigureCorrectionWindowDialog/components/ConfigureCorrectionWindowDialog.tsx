/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useEffect } from 'react';

import { Result, CorrectionConfiguration } from '@instana/types';
import { CreateTearsheet } from '@instana/ibm-products';

import {
  SLO_CORRECTION_WINDOW_DIALOG_CLOSE,
  SLO_CORRECTION_WINDOW_DIALOG_ERROR,
  SLO_CORRECTION_WINDOW_DIALOG_FINISH,
  SLO_CORRECTION_WINDOW_DIALOG_OPEN
} from 'in-services/tracking/eventNames';
import CorrectionWindowFormContext from 'in-service-levels/features/CorrectionWindows/components/ConfigureCorrectionWindowDialog/createCorrectionWindowForm/CorrectionWindowFormContext';
import useHandleCorrectionWindowForm from 'in-service-levels/features/CorrectionWindows/components/ConfigureCorrectionWindowDialog/hooks/useHandleCorrectionWindowForm';
import { formToCorrectionWindow } from 'in-service-levels/features/CorrectionWindows/components/ConfigureCorrectionWindowDialog/createCorrectionWindowForm/utils';
import { CorrectionWindowForm } from 'in-service-levels/features/CorrectionWindows/components/ConfigureCorrectionWindowDialog/createCorrectionWindowForm/types';
import ScheduleSection from 'in-service-levels/features/CorrectionWindows/components/ConfigureCorrectionWindowDialog/components/ScheduleSection';
import ScopeSection from 'in-service-levels/features/CorrectionWindows/components/ConfigureCorrectionWindowDialog/components/ScopeSection';
import { UnstableTrackingFunction, useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { SloTrackingMeta, ConfigureDialogMode } from 'in-service-levels/types';
import { CREATED_OBJECT, UPDATED_OBJECT } from 'in-services/util/constants';
import { close as closeDialog } from 'in-components/DialogPresenter/store';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { ServiceLevelErrors } from 'in-service-levels/constants';
import { seconds } from 'in-services/time/time';
import { t } from 'in-i18n';

import locals from './ConfigureCorrectionWindowDialog.mless';

interface CreateModeProps {
  mode: 'NEW';
  trackingMeta: SloTrackingMeta;
  configuration?: never;
}

interface CloneModeProps {
  mode: 'CLONE';
  configuration: CorrectionConfiguration;
  trackingMeta: SloTrackingMeta;
}

interface EditModeProps {
  mode: 'EDIT';
  configuration: CorrectionConfiguration;
  trackingMeta: SloTrackingMeta;
}

type ConfigureCorrectionWindowDialogProps = CreateModeProps | CloneModeProps | EditModeProps;

export default function ConfigureCorrectionWindowDialog(props: CreateModeProps): JSX.Element;
export default function ConfigureCorrectionWindowDialog(props: CloneModeProps): JSX.Element;
export default function ConfigureCorrectionWindowDialog(props: EditModeProps): JSX.Element;
export default function ConfigureCorrectionWindowDialog({
  configuration,
  mode,
  trackingMeta
}: ConfigureCorrectionWindowDialogProps): JSX.Element {
  const { form, setForm, updateForm, submitStatus, doSubmit, errors } = useHandleCorrectionWindowForm({
    configuration,
    mode
  });
  const { trackCta, unstable_trackEvent } = useSegmentTracking();

  useEffect(() => {
    trackCta(
      SLO_CORRECTION_WINDOW_DIALOG_OPEN,
      {
        productArea: trackingMeta.productArea,
        pageName: trackingMeta.pageName
      },
      undefined
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onClose = () => {
    trackCta(SLO_CORRECTION_WINDOW_DIALOG_CLOSE, {
      productArea: trackingMeta.productArea,
      pageName: trackingMeta.pageName
    });
    closeDialog();
  };

  const onRequestSubmit = () =>
    new Promise<void>((resolve, reject) => {
      doSubmit({
        payload: formToCorrectionWindow(form, mode === 'EDIT' ? configuration : undefined),
        onSuccess: (result: Result<CorrectionConfiguration>) => {
          resolve();
          onSuccess(mode, result, trackingMeta, unstable_trackEvent);
        },
        onError: (result?: Result<CorrectionConfiguration>) => {
          reject();
          onError(mode, trackingMeta, result, unstable_trackEvent);
        }
      });
    });

  return (
    <CorrectionWindowFormContext.Provider
      value={{
        form,
        mode,
        onChange: (path, fn) => updateForm(form.updateIn(path, fn) as CorrectionWindowForm),
        setForm,
        updateForm
      }}
    >
      <CreateTearsheet
        open
        className={locals['configure-correction-window']}
        title={
          mode === 'EDIT'
            ? t('in-service-levels:configureCorrectionWindowDialog.title.edit')
            : t('in-service-levels:configureCorrectionWindowDialog.title.create')
        }
        submitButtonText={
          mode === 'EDIT'
            ? t('in-service-levels:general.saveButtonLabel')
            : t('in-service-levels:general.createButtonLabel')
        }
        cancelButtonText={t('in-service-levels:general.cancelButtonLabel')}
        backButtonText={t('in-service-levels:general.backButtonLabel')}
        nextButtonText={t('in-service-levels:general.nextButtonLabel')}
        onRequestSubmit={onRequestSubmit}
        onClose={onClose}
      >
        <ScheduleSection />
        <ScopeSection submitStatus={submitStatus} errors={errors} />
      </CreateTearsheet>
    </CorrectionWindowFormContext.Provider>
  );
}

function onSuccess(
  mode: ConfigureDialogMode,
  result: Result<CorrectionConfiguration>,
  trackingMeta: SloTrackingMeta,
  track: UnstableTrackingFunction
) {
  if (!result?.data) throw Error(ServiceLevelErrors.UNEXPECTED_CORRECTION_WINDOW_CREATION_ERROR);

  const { name, id, scheduling, active } = result.data;
  addMessage({
    type: 'success',
    timeout: seconds.toMillis(4),
    title: t('in-service-levels:configureCorrectionWindowDialog.messages.successfulTitle', { context: mode }),
    content: t('in-service-levels:configureCorrectionWindowDialog.messages.successfulContent', {
      context: mode,
      name
    })
  });

  track(
    CREATED_OBJECT,
    {
      productArea: trackingMeta.productArea,
      pageName: trackingMeta.pageName,
      objectType: SLO_CORRECTION_WINDOW_DIALOG_FINISH
    },
    {
      id,
      mode,
      recurrentRule: scheduling?.recurrentRule,
      duration: scheduling?.duration,
      durationUnit: scheduling?.durationUnit,
      startTime: scheduling?.startTime,
      recurrent: scheduling?.recurrent,
      active
    }
  );

  closeDialog();
}

function onError(
  mode: ConfigureDialogMode,
  trackingMeta: SloTrackingMeta,
  result: Result<CorrectionConfiguration> | undefined,
  track: UnstableTrackingFunction
) {
  if (result && result.errors.length !== 0) {
    track(
      UPDATED_OBJECT,
      {
        productArea: trackingMeta.productArea,
        pageName: trackingMeta.pageName,
        objectType: SLO_CORRECTION_WINDOW_DIALOG_ERROR
      },
      {
        mode,
        code: 'API_ERROR'
      }
    );

    return;
  }

  if (!result?.data) {
    track(
      UPDATED_OBJECT,
      {
        productArea: trackingMeta.productArea,
        pageName: trackingMeta.pageName,
        objectType: SLO_CORRECTION_WINDOW_DIALOG_ERROR
      },
      {
        mode,
        code: 'UNEXPECTED_ERROR'
      }
    );

    return;
  }

  track(
    UPDATED_OBJECT,
    {
      productArea: trackingMeta.productArea,
      pageName: trackingMeta.pageName,
      objectType: SLO_CORRECTION_WINDOW_DIALOG_ERROR
    },
    {
      mode,
      code: 'INVALID_SLO_CORRECTION_WINDOW'
    }
  );

  return;
}
