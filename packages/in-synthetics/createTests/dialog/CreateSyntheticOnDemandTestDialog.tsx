/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useState } from 'react';
import { MapForm } from 'formalistic';

import { CarbonInlineLoading as InlineLoading } from '@instana/components';
import { Tearsheet } from '@instana/ibm-products';

import CreateSyntheticOnDemandTestDialogPresenter from 'in-synthetics/createTests/dialog/CreateSyntheticOnDemandTestDialogPresenter';
import { showCICDCreateSuccessMessage, showCreateErrorMessage } from 'in-synthetics/createTests/utils/userFeedback';
import { CICDConfig, CreateSyntheticOnDemandProps } from 'in-synthetics/utils/constants';
import { createRunNowForm } from 'in-synthetics/createTests/form/createRunNowTestForm';
import deserializeErrorMessage from 'in-synthetics/utils/deserializeErrorMessage';
import { close } from 'in-components/DialogPresenter/store';
import { rerunTest } from 'in-synthetics/api';
import { t } from 'in-i18n';

import locals from 'in-synthetics/createTests/dialog/CreateSyntheticOnDemandTestDialogPresenter.mless';

const CreateSyntheticOnDemandTestDialog = ({
  testId,
  testLocations,
  onlineLocations
}: CreateSyntheticOnDemandProps) => {
  const [form, updateForm] = useState(createRunNowForm(testLocations));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createSyntheticOnDemandTest = (form: MapForm<any>, testId: string) => {
    const testConfig: CICDConfig[] = [
      {
        testId,
        customization: form.toJS()
      }
    ] as CICDConfig[];
    let closed = false;
    const closeOnce = () => {
      if (!closed) {
        closed = true;
        close();
      }
    };
    setIsSubmitting(true);
    const result$ = rerunTest(testConfig);
    const timeoutId = setTimeout(() => {
      closeOnce();
    }, 5000);

    result$.once(
      () => {
        clearTimeout(timeoutId);
        setIsSubmitting(false);
        showCICDCreateSuccessMessage();
        closeOnce();
      },
      error => {
        clearTimeout(timeoutId);
        setIsSubmitting(false);
        showCreateErrorMessage(deserializeErrorMessage(error.message), 'cicd-create');
        closeOnce();
      }
    );
  };

  const actionButtons = [
    {
      kind: 'primary',
      disabled:
        isSubmitting || (form.get('locations').value.length == 0 && form.get('locations').hierarchyTouched === true),
      label: isSubmitting ? '' : t('in-synthetics:dialog.createOnDemandTest.createButtonLabel'),
      renderIcon: isSubmitting
        ? () => (
            <InlineLoading
              className={locals.loadingProperties}
              description={t('in-synthetics:dialog.createOnDemandTest.iconLabel')}
            />
          )
        : undefined,
      iconDescription: isSubmitting
        ? t('in-synthetics:dialog.createOnDemandTest.iconLabel')
        : t('in-synthetics:dialog.createOnDemandTest.buttonLabel'),
      onClick: () => createSyntheticOnDemandTest(form, testId)
    },
    {
      kind: 'ghost',
      label: t('in-synthetics:dialog.createOnDemandTest.cancel'),
      onClick: () => close()
    }
  ];
  return (
    <>
      {/* @ts-expect-error */}
      <Tearsheet title={t('in-synthetics:dialog.createOnDemandTest.runnowTitle')} actions={actionButtons} open>
        <CreateSyntheticOnDemandTestDialogPresenter
          form={form}
          updateForm={updateForm}
          testLocations={testLocations}
          onlineLocations={onlineLocations}
        />
      </Tearsheet>
    </>
  );
};
export default CreateSyntheticOnDemandTestDialog;
