/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';
import { MapForm } from 'formalistic';

import { useObservable } from '@instana/hooks';

import SimpleModePageNavigation from 'in-components/BlueprintFormMultistep/SimpleModePageNavigation';
import { NewPerspectiveFormStepOne } from 'in-bizops/lists/businessPerspectives/creation/NewPerspectiveFormStepOne';
import { NewPerspectiveFormStepTwo } from 'in-bizops/lists/businessPerspectives/creation/NewPerspectiveFormStepTwo';
import createNewPerspectiveForm from 'in-bizops/lists/businessPerspectives/creation/createNewPerspectiveForm';
import { isQueryValid } from 'in-bizops/lists/businessPerspectives/components/BusinessProcessQueryBuilder';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { businessPerspectiveDashboard, summaryTab } from 'in-bizops/navigation/paths';
import DialogWithSlideInView from 'in-components/Dialog/DialogWithSlideInView';
import { StepConfigs } from 'in-components/BlueprintFormMultistep/StepConfigs';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { getBusinessMonitoringTagCatalog } from 'in-bizops/api/catalog';
import { createBusinessPerspective } from 'in-bizops/api/perspectives';
import { HttpResponse, PerspectiveItem } from 'in-bizops/utils/types';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { bizopsPerspectiveCreated } from 'in-bizops/tracker';
import { close } from 'in-components/DialogPresenter/store';
import { TIMEOUT_IN_MS } from 'in-bizops/utils/constants';
import { pendingResult } from 'in-services/fixedObjects';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { noop } from 'in-services/util/function';
import { BusinessPerspective } from 'in-types';
import { t } from 'in-i18n';

import locals from 'in-bizops/lists/businessPerspectives/creation/NewPerspective.mless';

export function NewPerspectiveDialogPresenter() {
  const timeConfig = useTimeConfig();
  const { location, navigate } = useNavigation();

  const stepConfigs: StepConfigs = [
    {
      title: t('in-bizops:perspectives.dialog.stepOne.progressBarTitle'),
      validateIntermediately: [['tagFilterExpression']]
    },
    { title: t('in-bizops:perspectives.dialog.stepTwo.progressBarTitle') }
  ];

  const [form, updateForm] = useState(createNewPerspectiveForm());
  const formId = 'new-business-perspective-form';

  const [step, setStep] = useState(0);

  const blueprintCatalogResult = useObservable(getBusinessMonitoringTagCatalog(), []) ?? pendingResult;

  const tagFilterExpressionFormModel = form.get('tagFilterExpression')?.value;
  const validTagFilterExpressionResult =
    useObservable(isQueryValid, [tagFilterExpressionFormModel, timeConfig]) ?? pendingResult;

  function onCreate(form: MapForm<any>) {
    const requestBody: PerspectiveItem = {
      name: form.get('perspectiveName').value,
      description: form.get('perspectiveDescription').value,
      tagFilterExpression: toBackendQueryModel(form.get('tagFilterExpression').value)
    };
    createBusinessPerspective(requestBody).once(onSuccess, onError);
  }

  /*
    Callback functions for the backend after the UI submits
    an API request to create a new perspective
  */
  function onSuccess(item: BusinessPerspective) {
    close();
    const trackerData = {
      path: location.pathname,
      successFlag: true,
      perspectiveId: item.id,
      perspectiveName: item.name
    };
    bizopsPerspectiveCreated(trackerData);
    location.pathname = `${businessPerspectiveDashboard}${summaryTab}`;
    setOrDeleteMatrixKey(location, businessPerspectiveDashboard, 'perspectiveId', item.id);
    setOrDeleteMatrixKey(location, businessPerspectiveDashboard, 'perspectiveName', item.name);
    navigate(location);
    addMessage({
      type: 'info',
      title: t('in-bizops:perspectives.successMessages.businessPerspectiveCreated'),
      content: t('in-bizops:perspectives.successMessages.perspectiveWasSuccessfullyCreated', {
        perspectiveName: item.name
      }),
      timeout: TIMEOUT_IN_MS
    });
  }

  function onError(data: HttpResponse) {
    close();
    const trackerData = {
      path: location.pathname,
      successFlag: false,
      errorMessage: data.response.body.errors,
      perspectiveName: form.get('perspectiveName').value
    };
    bizopsPerspectiveCreated(trackerData);
    addMessage({
      type: 'danger',
      title: t('in-bizops:perspectives.errorMessages.createOperationFailed'),
      content: t('in-bizops:perspectives.errorMessages.unableToCreatePerspective'),
      timeout: TIMEOUT_IN_MS
    });
  }

  return (
    <DialogWithSlideInView
      title={t('in-bizops:perspectives.dialog.title')}
      onClose={close}
      doNotCloseOnOutsideClick
      withoutBodyPadding
    >
      <div className={locals.dialog}>
        <SimpleModePageNavigation
          onClose={close}
          stepConfigs={stepConfigs}
          form={form}
          formId={formId}
          updateForm={updateForm}
          simpleModeStep={step}
          setSimpleModeStep={setStep}
          additionalStepCheck={() => validTagFilterExpressionResult?.data}
          noStepCheckOnFirstStep
          onCreate={() => {
            onCreate(form);
          }}
          onStepChanged={noop}
          renderStep={(step: number) => {
            switch (step) {
              case 0:
                return (
                  <NewPerspectiveFormStepOne
                    form={form}
                    updateForm={updateForm}
                    blueprintCatalogResult={blueprintCatalogResult}
                    timeConfig={timeConfig}
                  />
                );
              case 1:
                return (
                  <NewPerspectiveFormStepTwo
                    form={form}
                    updateForm={updateForm}
                    blueprintCatalogResult={blueprintCatalogResult}
                    timeConfig={timeConfig}
                  />
                );
              default:
                return null;
            }
          }}
        />
      </div>
    </DialogWithSlideInView>
  );
}
