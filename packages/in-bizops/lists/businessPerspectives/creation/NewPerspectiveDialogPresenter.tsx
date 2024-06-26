/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';
import { MapForm } from 'formalistic';

import {
  Order,
  Pagination,
  TimeConfig,
  BusinessDataQuery,
  TagFilterExpressionElementUnion,
  BusinessProcess,
  PaginatedResult,
  Result
} from '@instana/types';
import { useObservable } from '@instana/hooks';

// @ts-expect-error Need to translate file to TS
import SimpleModePageNavigation from 'in-components/BlueprintFormMultistep/SimpleModePageNavigation';
import { NewPerspectiveFormStepOne } from 'in-bizops/lists/businessPerspectives/creation/NewPerspectiveFormStepOne';
import { NewPerspectiveFormStepTwo } from 'in-bizops/lists/businessPerspectives/creation/NewPerspectiveFormStepTwo';
import createNewPerspectiveForm from 'in-bizops/lists/businessPerspectives/creation/createNewPerspectiveForm';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { businessPerspectiveDashboard, summaryTab } from 'in-bizops/navigation/paths';
import getBusinessProcesses from 'in-bizops/subscriptions/getBusinessProcesses';
import DialogWithSlideInView from 'in-components/Dialog/DialogWithSlideInView';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { getBusinessMonitoringTagCatalog } from 'in-bizops/api/catalog';
import { createBusinessPerspective } from 'in-bizops/api/perspectives';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { close } from 'in-components/DialogPresenter/store';
import { pendingResult } from 'in-services/fixedObjects';
import { PerspectiveItem } from 'in-bizops/utils/types';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { noop } from 'in-services/util/function';
import { t } from 'in-i18n';

import locals from 'in-bizops/lists/businessPerspectives/creation/NewPerspective.mless';

export function NewPerspectiveDialogPresenter() {
  const timeConfig = useTimeConfig();
  const { location, navigate } = useNavigation();

  const stepConfigs = [
    { title: t('in-bizops:perspectives.dialog.stepOne.progressBarTitle') },
    { title: t('in-bizops:perspectives.dialog.stepTwo.progressBarTitle') }
  ];

  const [form, updateForm] = useState(createNewPerspectiveForm());
  const formId = 'new-business-perspective-form';

  const [step, setStep] = useState(0);

  const blueprintCatalogResult = useObservable(getBusinessMonitoringTagCatalog(), []) ?? pendingResult;

  const tagFilterExpression: FormModelElement[] = form.get('tagFilterExpression').value;
  const processesLiveList: Result<PaginatedResult<BusinessProcess>> = useProcessesLiveList(
    tagFilterExpression,
    timeConfig
  );

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
  //TODO! Implement
  function onSuccess(item: PerspectiveItem) {
    location.pathname = `${businessPerspectiveDashboard}${summaryTab}`;
    setOrDeleteMatrixKey(location, businessPerspectiveDashboard, 'perspectiveId', item.id);
    navigate(location);
    close();
  }

  function onError() {}

  return (
    <DialogWithSlideInView
      title={t('in-bizops:perspectives.dialog.title')}
      className={locals.dialog}
      onClose={close}
      doNotCloseOnOutsideClick
    >
      <SimpleModePageNavigation
        onClose={close}
        stepConfigs={stepConfigs}
        form={form}
        formId={formId}
        updateForm={updateForm}
        simpleModeStep={step}
        setSimpleModeStep={setStep}
        onCreate={() => {
          onCreate(form);
        }} //! TODO This is where the UI should send the request to create the perspective to the backend, and handle errors
        onStepChanged={noop}
        renderStep={(step: number) => {
          switch (step) {
            case 0:
              return (
                <NewPerspectiveFormStepOne
                  form={form}
                  updateForm={updateForm}
                  blueprintCatalogResult={blueprintCatalogResult}
                  processesLiveList={processesLiveList}
                />
              );
            case 1:
              return (
                <NewPerspectiveFormStepTwo form={form} updateForm={updateForm} processesLiveList={processesLiveList} />
              );
            default:
              return null;
          }
        }}
      />
    </DialogWithSlideInView>
  );
}

function useProcessesLiveList(
  tagFilterExpressionFormModel: FormModelElement[],
  timeConfig: TimeConfig
): Result<PaginatedResult<BusinessProcess>> {
  const pagination: Pagination = {
    page: 1,
    pageSize: 5
  };
  const order: Order = {
    by: 'process_name',
    direction: 'ASC'
  };
  const tagFilterExpression: TagFilterExpressionElementUnion = toBackendQueryModel(tagFilterExpressionFormModel);

  const businessDataQuery: BusinessDataQuery = {
    dataType: 'PROCESS',
    metrics: {},
    pagination: pagination,
    tagFilterExpression: tagFilterExpression,
    timeConfig: timeConfig,
    order: order
  };
  return useObservable(getBusinessProcesses(businessDataQuery), [tagFilterExpressionFormModel]) ?? pendingResult;
}
