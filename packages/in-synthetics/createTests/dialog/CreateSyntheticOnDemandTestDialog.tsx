/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useState } from 'react';
import { MapForm } from 'formalistic';

import { CarbonInlineLoading as InlineLoading } from '@instana/components';
import { Tearsheet } from '@instana/ibm-products';
import { useObservable } from '@instana/hooks';

import CreateSyntheticOnDemandTestDialogPresenter from 'in-synthetics/createTests/dialog/CreateSyntheticOnDemandTestDialogPresenter';
import { showCICDCreateSuccessMessage, showCreateErrorMessage } from 'in-synthetics/createTests/utils/userFeedback';
import { runTypeCICD, CICDConfig, CreateSyntheticOnDemandTestDialogProps } from 'in-synthetics/utils/constants';
import { createRunNowForm } from 'in-synthetics/createTests/form/createRunNowTestForm';
import deserializeErrorMessage from 'in-synthetics/utils/deserializeErrorMessage';
import { getLocations, rerunTest } from 'in-synthetics/api';
import { close } from 'in-components/DialogPresenter/store';
import { pendingResult } from 'in-services/fixedObjects';
import { Result, SyntheticLocation } from 'in-types';
import { t } from 'in-i18n';

import locals from 'in-synthetics/createTests/dialog/CreateSyntheticOnDemandTestDialogPresenter.mless';

const CreateSyntheticOnDemandTestDialog = ({
  testId,
  testLocations,
  testType
}: CreateSyntheticOnDemandTestDialogProps) => {
  const [form, updateForm] = useState(createRunNowForm(testLocations));
  const syntheticLocationList: Result<SyntheticLocation[]> =
    useObservable<any, any[]>(() => getLocations(), []) ?? pendingResult;
  let onlineLocations: SyntheticLocation[] =
    syntheticLocationList.data?.filter(
      loc =>
        loc.status === 'Online' &&
        loc.playbackCapabilities.syntheticType.includes(testType) &&
        loc.playbackCapabilities.executionType?.includes(runTypeCICD)
    ) ?? [];
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
