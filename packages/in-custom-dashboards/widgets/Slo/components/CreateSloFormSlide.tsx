/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import useResizeObserver from 'use-resize-observer/polyfilled';
import React, { useEffect } from 'react';

import { Result, ServiceLevelObjectiveConfiguration } from '@instana/types';
import { generateStableHash } from '@instana/utils';
import { t } from '@instana/i18n-react';

import ConfigDialogTimeConfigContextModification from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloScopeSection/ConfigDialogTimeConfigContextModification';
import {
  SLO_CONFIG_DIALOG_CLOSE,
  SLO_CONFIG_DIALOG_ERROR,
  SLO_CONFIG_DIALOG_FINISH
} from 'in-services/tracking/eventNames';
import SloFormStepsContainer from 'in-service-levels/components/ConfigDialog/components/SloFormStepsContainer';
import { SlideInViewContentProps } from 'in-custom-dashboards/CustomDashboard/WidgetEditorDialog/types';
import { formToSloConfiguration } from 'in-service-levels/components/ConfigDialog/createSloForm/utils';
import { CreateSloDialogMode, SloForm } from 'in-service-levels/components/ConfigDialog/createSloForm';
import { UnstableTrackingFunction, useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import SloFormContext from 'in-service-levels/components/ConfigDialog/createSloForm/SloFormContext';
import { resetChildrenScrollPosition } from 'in-custom-dashboards/widgets/Slo/utils/slideInView';
import FormFooter, { CancelButton, SaveButton } from 'in-components/form/FormFooter/FormFooter';
import { CREATED_OBJECT, ENDED_PROCESS, UPDATED_OBJECT } from 'in-services/util/constants';
import getTranslatedErrorMessage from 'in-service-levels/components/ConfigDialog/errors';
import { CreateSloFormSlideState } from 'in-custom-dashboards/widgets/Slo/types';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import useHandleSloForm from 'in-service-levels/hooks/useHandleSloForm';
import { productAreas } from 'in-services/tracking/productAreas';
import { ServiceLevelErrors } from 'in-service-levels/constants';
import { pageNames } from 'in-services/tracking/pageNames';
import { seconds } from 'in-services/time/time';

import locals from './CreateSloFormSlide.mless';

// Fallback height for the height of the visible content
const MIN_VIEW_HEIGHT = 522;

// Use static height because useResizeObserver causes infinite loops when called
// on footer
const MIN_FOOTER_HEIGHT = 65;

const FORM_MODE: CreateSloDialogMode = 'NEW';

interface CreateSloFormSlideProps extends SlideInViewContentProps<CreateSloFormSlideState> {
  onCreationSuccessful: (sloConfig: ServiceLevelObjectiveConfiguration) => void;
}

export default function CreateSloFormSlide({ slideOut, subSlideState, onCreationSuccessful }: CreateSloFormSlideProps) {
  const { form, setForm, updateForm, submitStatus, doSubmit, resetForm } = useHandleSloForm({ mode: FORM_MODE });
  const { ref: wrapperRef } = useResizeObserver<HTMLDivElement>();
  const { unstable_trackEvent } = useSegmentTracking();
  // Because the SlideInView together with a StepsContainer is causing some
  // trouble we have to dynamically calculate the height of the form body
  const parentElement = wrapperRef.current?.parentElement;
  const viewHeight = parentElement?.clientHeight ?? MIN_VIEW_HEIGHT;
  const bodyHeight = viewHeight - MIN_FOOTER_HEIGHT;

  const onCloseSlide = () => {
    slideOut();
    resetChildrenScrollPosition(parentElement);
    resetForm();
    unstable_trackEvent(
      ENDED_PROCESS,
      {
        productArea: productAreas.custom_dashboard,
        pageName: pageNames.custom_dashboard,
        objectType: SLO_CONFIG_DIALOG_CLOSE
      },
      undefined
    );
  };

  useEffect(() => {
    // There are three ways to close the SlideInView (header click, cancel
    // button and success handler) and all of them use different handlers what
    // forces us to pass a single callback to the SlideInView controller in
    // utils/slideInView.tsx, in order to reliably reset the form values and
    // scroll positions of all elements within the SubSlideView by calling the
    // same function.
    const [slideState, setSubSlideState] = subSlideState;
    setSubSlideState({ ...slideState, onCloseSlide });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generateStableHash(subSlideState)]);

  return (
    <SloFormContext.Provider
      value={{
        form,
        mode: FORM_MODE,
        onChange: (path, fn) => updateForm(form.updateIn(path, fn) as SloForm),
        setForm
      }}
    >
      <ConfigDialogTimeConfigContextModification>
        <div ref={wrapperRef}>
          <div className={locals.body} style={{ height: bodyHeight }}>
            <SloFormStepsContainer />
          </div>
          <FormFooter className={locals.formFooter}>
            <CancelButton onClick={onCloseSlide}>{t('in-service-levels:general.cancelButtonLabel')}</CancelButton>
            <SaveButton
              onClick={() => {
                updateForm(form.setTouched(true, { recurse: true }));

                if (!form.hierarchyValid) return;

                doSubmit({
                  onSuccess: result => {
                    onSuccess(result, unstable_trackEvent);
                    onCreationSuccessful(result.data!);
                  },
                  onError: result => {
                    onError(result, unstable_trackEvent);
                  },
                  payload: formToSloConfiguration(form)
                });
              }}
              isSaving={submitStatus === 'pending'}
            >
              {t('in-service-levels:general.saveButtonLabel')}
            </SaveButton>
          </FormFooter>
        </div>
      </ConfigDialogTimeConfigContextModification>
    </SloFormContext.Provider>
  );
}

function onSuccess({ data }: Result<ServiceLevelObjectiveConfiguration>, track: UnstableTrackingFunction) {
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

  track(
    CREATED_OBJECT,
    {
      productArea: productAreas.custom_dashboard,
      pageName: pageNames.custom_dashboard,
      objectType: SLO_CONFIG_DIALOG_FINISH
    },
    {
      id,
      mode: 'NEW',
      blueprint: indicator.blueprint,
      indicatorType: indicator.type,
      entityType: entity.type,
      timeWindowType: timeWindow.type
    }
  );
}

const errorMessageHeader = {
  type: 'danger',
  title: t('in-service-levels:createSloDialog.messages.creationFailedTitle')
} as const;

function onError(result: Result<ServiceLevelObjectiveConfiguration> | undefined, track: UnstableTrackingFunction) {
  if (result && result.errors.length !== 0) {
    track(
      UPDATED_OBJECT,
      {
        productArea: productAreas.custom_dashboard,
        pageName: pageNames.custom_dashboard,
        objectType: SLO_CONFIG_DIALOG_ERROR
      },
      {
        mode: FORM_MODE,
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
    track(
      UPDATED_OBJECT,
      {
        productArea: productAreas.custom_dashboard,
        pageName: pageNames.custom_dashboard,
        objectType: SLO_CONFIG_DIALOG_ERROR
      },
      {
        mode: FORM_MODE,
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

  track(
    UPDATED_OBJECT,
    {
      productArea: productAreas.custom_dashboard,
      pageName: pageNames.custom_dashboard,
      objectType: SLO_CONFIG_DIALOG_ERROR
    },
    {
      mode: FORM_MODE,
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
