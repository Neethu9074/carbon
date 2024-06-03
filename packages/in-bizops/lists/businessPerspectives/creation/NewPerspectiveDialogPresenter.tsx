/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';
import { MapForm } from 'formalistic';

import { Order, Pagination, TagFilterExpression, TimeConfig, BusinessDataQuery } from '@instana/types';
import { useObservable } from '@instana/hooks';

// @ts-expect-error Need to translate file to TS
import SimpleModePageNavigation from 'in-components/BlueprintFormMultistep/SimpleModePageNavigation';
import { NewPerspectiveFormStepOne } from 'in-bizops/lists/businessPerspectives/creation/NewPerspectiveFormStepOne';
import { NewPerspectiveFormStepTwo } from 'in-bizops/lists/businessPerspectives/creation/NewPerspectiveFormStepTwo';
import createNewPerspectiveForm from 'in-bizops/lists/businessPerspectives/creation/createNewPerspectiveForm';
import getBusinessProcesses from 'in-bizops/subscriptions/getBusinessProcesses';
import DialogWithSlideInView from 'in-components/Dialog/DialogWithSlideInView';
import { getBusinessMonitoringTagCatalog } from 'in-bizops/api/catalog';
import { createBusinessPerspective } from 'in-bizops/api/perspectives';
import { close } from 'in-components/DialogPresenter/store';
import { pendingResult } from 'in-services/fixedObjects';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { noop } from 'in-services/util/function';
import { t } from 'in-i18n';

import locals from 'in-bizops/lists/businessPerspectives/creation/NewPerspective.mless';

export function NewPerspectiveDialogPresenter() {
  const timeConfig = useTimeConfig();

  const stepConfigs = [
    { title: t('in-bizops:perspectives.dialog.stepOne.progressBarTitle') },
    { title: t('in-bizops:perspectives.dialog.stepTwo.progressBarTitle') }
  ];

  const [form, updateForm] = useState(() => createNewPerspectiveForm());
  const formId = 'new-business-perspective-form';

  const [simpleModeStep, setSimpleModeStep] = useState(0);

  const blueprintCatalogResult = useObservable(getBusinessMonitoringTagCatalog(), [timeConfig]) ?? pendingResult;

  const processesLiveList = useObservable(getProcessesLiveList(form, timeConfig), [
    form.get('tagFilterExpression').value
  ]);

  return (
    <DialogWithSlideInView
      title={t('in-bizops:perspectives.dialog.title')}
      className={locals.dialog}
      doNotCloseOnOutsideClick
    >
      <SimpleModePageNavigation
        onClose={close}
        stepConfigs={stepConfigs}
        form={form}
        formId={formId}
        updateForm={updateForm}
        simpleModeStep={simpleModeStep}
        setSimpleModeStep={setSimpleModeStep}
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

function getProcessesLiveList(form: MapForm<any>, timeConfig: TimeConfig) {
  const pagination: Pagination = {
    page: 1,
    pageSize: 5
  };
  const tagFilterExpression: TagFilterExpression = {
    elements: form.get('tagFilterExpression').value,
    logicalOperator: 'AND',
    type: 'EXPRESSION'
  };
  const order: Order = {
    by: 'process_name',
    direction: 'ASC'
  };

  const BusinessDataQuery: BusinessDataQuery = {
    dataType: 'PROCESS',
    metrics: {},
    pagination: pagination,
    tagFilterExpression: tagFilterExpression,
    timeConfig: timeConfig,
    order: order
  };
  return getBusinessProcesses(BusinessDataQuery);
}

interface requestBody {
  label: string;
  description: string;
  tagFilterExpression: TagFilterExpression;
}

function onCreate(form: MapForm<any>) {
  const requestBody: requestBody = {
    label: form.get('perspectiveName').value,
    description: form.get('perspectiveDescription').value,
    tagFilterExpression: {
      type: 'EXPRESSION',
      logicalOperator: 'AND',
      elements: form.get('tagFilterExpression').value
    }
  };
  createBusinessPerspective(requestBody).once(onSuccess, onError);
}

/*
  Callback functions for the backend after the UI submits
  an API request to create a new perspective
*/
//TODO! Implement
function onSuccess() {}

function onError() {}
