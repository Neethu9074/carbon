/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useState, useEffect } from 'react';

import { generateUniqueShortId } from '@instana/utils';
import { Stack, Message } from '@instana/components';
import { useObservable } from '@instana/hooks';
import { just } from '@instana/observables';

import { trackSLIEditAbort, trackSLICloned, trackSliNewCreated } from 'in-custom-dashboards/widgets/Slo/tracker';
import { isSliEventsQueryValid } from 'in-custom-dashboards/widgets/Slo/sli/SliEventsQueryBuilder';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { Spacer } from 'in-waiting-for-deployment/components/OnboardingWidget/contentComponents';
import FormFooter, { CancelButton, SaveButton } from 'in-components/form/FormFooter/FormFooter';
import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter';
import { sliFieldNames } from 'in-custom-dashboards/widgets/Slo/sli/sliForm';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { createSliConfiguration } from 'in-custom-dashboards/api';
import { pendingResult } from 'in-services/fixedObjects';
import useTimeConfig from 'in-hooks/useTimeConfig';
import Form from 'in-components/form/binding/Form';
import { success } from 'in-services/util/result';
import { t } from 'in-i18n';

export default function CreateSliForm({ form, updateForm, editMode, setFooter, close, children }) {
  const timeConfig = useTimeConfig();
  const [formSubmitState, setFormSubmitState] = useState({
    success: false,
    saving: false,
    error: false
  });
  const { saving } = formSubmitState;
  useSetFooter({ form, timeConfig, setFooter, close, saving, editMode });

  const onSubmit = submittedForm => {
    setFormSubmitState({
      saving: true,
      success: false,
      error: false
    });

    const enrichedSliConfiguration = {
      ...toBackendFormat(submittedForm),
      id: generateUniqueShortId(9)
    };

    if (submittedForm.hierarchyValid) {
      const createSliConfigResult$ = createSliConfiguration(enrichedSliConfiguration);
      createSliConfigResult$.once(
        onSaveSuccess(enrichedSliConfiguration, editMode),
        onSaveFailure(enrichedSliConfiguration, setFormSubmitState)
      );
    }
  };

  return (
    <Form form={form} setForm={updateForm} onSubmit={onSubmit} formId="createSliForm">
      <Stack gap="large">
        {children}
        {editMode && <Message>{t('in-custom-dashboards:widgets.slo.createSliForm.sliConfigMsg')}</Message>}
        <ErroneousResultPresenter errors={formSubmitState.errors} />
        <Spacer />
      </Stack>
    </Form>
  );
}

function useSetFooter({ form, timeConfig, setFooter, close, saving, editMode }) {
  const savingStateName = editMode
    ? t('in-custom-dashboards:widgets.slo.createSliForm.cloning')
    : t('in-custom-dashboards:widgets.slo.createSliForm.creating');
  const saveButtonLabel = editMode
    ? t('in-custom-dashboards:widgets.slo.createSliForm.clone')
    : t('in-custom-dashboards:widgets.slo.createSliForm.create');
  const isValid = useValidateExpressions(form, timeConfig);

  useEffect(() => {
    setFooter(
      <FormFooter withRoundedBottomBorder>
        <CancelButton
          onClick={() => {
            const sliEntityForm = form.get('sliEntity');
            const sliType = sliEntityForm?.get('sliType')?.value;
            trackSLIEditAbort({ sliId: editMode, sliType });
            close();
          }}
        />
        <SaveButton form={form} isSaving={saving} disabled={!isValid} formId="createSliForm">
          {saving ? savingStateName : saveButtonLabel}
        </SaveButton>
      </FormFooter>
    );
    return () => {
      setFooter(null);
    };
  }, [close, form, isValid, saveButtonLabel, saving, savingStateName, setFooter, editMode]);
}

function useValidateExpressions(form, timeConfig) {
  const sliEntityForm = form.get('sliEntity');
  const sliType = sliEntityForm.get('sliType')?.value;
  const goodEventFilterExpression = sliEntityForm.get(sliFieldNames.goodEventFilterExpression)?.value;
  const badEventFilterExpression = sliEntityForm.get(sliFieldNames.badEventFilterExpression)?.value;

  // Only availability SLIs use query builder, and therefore only these need to be validated
  const requiresQueryValidation = sliType === 'availability';

  const { data: goodEventsValidationResult } = useValidateExpression(
    goodEventFilterExpression,
    requiresQueryValidation,
    timeConfig
  );
  const { data: badEventsValidationResult } = useValidateExpression(
    badEventFilterExpression,
    requiresQueryValidation,
    timeConfig
  );
  return goodEventsValidationResult && badEventsValidationResult;
}

function useValidateExpression(tagFilterExpression, requiresQueryValidation, timeConfig) {
  return (
    useObservable(
      args => {
        if (requiresQueryValidation) return isSliEventsQueryValid(args);
        return just(success(true));
      },
      [tagFilterExpression, timeConfig, requiresQueryValidation]
    ) ?? pendingResult
  );
}

function toBackendFormat(form) {
  const formData = form.toJS();
  const goodEvents = formData.sliEntity[sliFieldNames.goodEventFilterExpression];
  const badEvents = formData.sliEntity[sliFieldNames.badEventFilterExpression];
  formData.sliEntity[sliFieldNames.goodEventFilterExpression] = toBackendQueryModel(goodEvents);
  formData.sliEntity[sliFieldNames.badEventFilterExpression] = toBackendQueryModel(badEvents);
  return formData;
}

function onSaveSuccess(enrichedSliConfiguration, editMode) {
  return () => {
    addMessage(
      {
        type: 'info',
        timeout: 4000,
        title: t('in-custom-dashboards:widgets.slo.createSliForm.sliCreateSuccess'),
        content: t('in-custom-dashboards:widgets.slo.createSliForm.sliCreated', {
          sliName: enrichedSliConfiguration.sliName
        })
      },
      'custom-dashboard-sli'
    );
    if (editMode) {
      trackSLICloned({ sliType: enrichedSliConfiguration.sliEntity?.sliType });
    } else {
      trackSliNewCreated({ sliType: enrichedSliConfiguration.sliEntity?.sliType });
    }
    close();
  };
}

function onSaveFailure(enrichedSliConfiguration, setFormSubmitState) {
  return () => {
    addMessage(
      {
        type: 'danger',
        timeout: 4000,
        title: t('in-custom-dashboards:widgets.slo.createSliForm.failCreateSli'),
        content: t('in-custom-dashboards:widgets.slo.createSliForm.problemCreateSli', {
          sliName: enrichedSliConfiguration.sliName
        })
      },
      'custom-dashboard-error'
    );
    setFormSubmitState(prevState => ({
      ...prevState,
      error: true
    }));
  };
}
