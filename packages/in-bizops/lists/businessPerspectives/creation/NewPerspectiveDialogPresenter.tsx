/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';
import { MapForm } from 'formalistic';

import { BusinessPerspective } from '@instana/types';
import { Tearsheet } from '@instana/ibm-products';
import { Typography } from '@instana/components';
import { useObservable } from '@instana/hooks';
import { Modal } from '@instana/carbon';

// @ts-expect-error Module needs to be translated to TS
import { validateFormModel } from 'in-components/QueryBuilder/validation/formModel';
import createNewPerspectiveForm from 'in-bizops/lists/businessPerspectives/creation/createNewPerspectiveForm';
import { NewPerspectiveForm } from 'in-bizops/lists/businessPerspectives/creation/NewPerspectiveForm';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import ProcessesLiveList from 'in-bizops/lists/businessPerspectives/creation/ProcessesLiveList';
import { businessPerspectiveDashboard, summaryTab } from 'in-bizops/navigation/paths';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { getBusinessMonitoringTagCatalog } from 'in-bizops/api/catalog';
import { createBusinessPerspective } from 'in-bizops/api/perspectives';
import { HttpResponse, PerspectiveItem } from 'in-bizops/utils/types';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { bizopsPerspectiveCreated } from 'in-bizops/tracker';
import { TIMEOUT_IN_MS } from 'in-bizops/utils/constants';
import { pendingResult } from 'in-services/fixedObjects';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

import local from 'in-bizops/lists/businessPerspectives/creation/NewPerspective.mless';

interface NewPerspectiveDialogPresenterProps {
  setOpen: (open: boolean) => void;
  open: boolean;
}

export function NewPerspectiveDialogPresenter({ setOpen, open }: NewPerspectiveDialogPresenterProps) {
  const timeConfig = useTimeConfig();
  const { location, navigate } = useNavigation();

  const [form, updateForm] = useState(createNewPerspectiveForm());
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);

  const blueprintCatalogResult =
    useObservable(getBusinessMonitoringTagCatalog({ useCase: 'FILTERING' }), []) ?? pendingResult;

  const tagFilterExpressionFormModel = form.get('tagFilterExpression')?.value;
  const tagFilterExpressionEmpty = tagFilterExpressionFormModel.length == 0;
  const validTagFilterExpressionQuery =
    !tagFilterExpressionEmpty &&
    validateFormModel({ tagCatalog: blueprintCatalogResult?.data, formModel: tagFilterExpressionFormModel }).isValid;

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
    setOpen(false);
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
    setOpen(false);
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
    <>
      {/* @ts-expect-error the tearsheet type is missing the children prop for some reason */}
      <Tearsheet
        className={local.tearsheetOuter}
        title={t('in-bizops:perspectives.dialog.title')}
        actions={[
          {
            key: 1,
            kind: 'primary',
            label: t('in-bizops:perspectives.dialog.create'),
            disabled: !validTagFilterExpressionQuery || !form.hierarchyValid,
            onClick: () => {
              onCreate(form);
              setOpen(false);
            }
          },
          {
            key: 2,
            kind: 'secondary',
            label: t('in-bizops:perspectives.dialog.cancel'),
            onClick: () => {
              setCancelConfirmOpen(true);
            }
          }
        ]}
        influencer={
          <div className={local.influencer}>
            <ProcessesLiveList
              tagFilterExpressionFormModel={tagFilterExpressionFormModel}
              blueprintCatalogResult={blueprintCatalogResult}
              timeConfig={timeConfig}
            />
          </div>
        }
        influencerPosition="right"
        influencerWidth="wide"
        open={open}
        onClose={() => setOpen(false)}
      >
        <NewPerspectiveForm form={form} updateForm={updateForm} blueprintCatalogResult={blueprintCatalogResult} />
      </Tearsheet>
      <Modal
        danger
        size="sm"
        open={cancelConfirmOpen}
        modalHeading={t('in-bizops:perspectives.dialog.cancelModal.heading')}
        primaryButtonText={t('in-bizops:perspectives.dialog.cancelModal.confirm')}
        secondaryButtonText={t('in-bizops:perspectives.dialog.cancelModal.continue')}
        onRequestSubmit={() => {
          updateForm(createNewPerspectiveForm());
          setOpen(false);
          setCancelConfirmOpen(false);
        }}
        onRequestClose={() => setCancelConfirmOpen(false)}
      >
        <Typography variant="body-01">{t('in-bizops:perspectives.dialog.cancelModal.body')}</Typography>
      </Modal>
    </>
  );
}
