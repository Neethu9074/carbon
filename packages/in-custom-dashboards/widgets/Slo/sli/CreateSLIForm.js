/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import { useObservable } from '@instana/hooks';
import { just } from '@instana/observables';

import { trackSliNewCreated, trackSLICloned, trackSLIEditAbort } from 'in-custom-dashboards/widgets/Slo/tracker';
import { resetFormForSliType, createForm, sliFieldNames } from 'in-custom-dashboards/widgets/Slo/sli/sliForm';
import { toBackendQueryModel } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import { isSliEventsQueryValid } from 'in-custom-dashboards/widgets/Slo/sli/SliEventsQueryBuilder';
import FormFooter, { SaveButton, CancelButton } from 'in-components/form/FormFooter/FormFooter';
import ErroneousResultPresenter from 'in-new-components/Errors/ErroneousResultPresenter';
import { SliForm } from 'in-custom-dashboards/widgets/Slo/sli/SliFormPresenter';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { createSliConfiguration } from 'in-custom-dashboards/api';
import { generateUniqueShortId } from 'in-services/util/id';
import { pendingResult } from 'in-services/fixedObjects';
import Form from 'in-components/form/binding/Form';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { success } from 'in-services/util/result';
import Message from 'in-new-components/Message';
import Stack from 'in-components/layout/Stack';
import { t } from 'in-i18n';

export default function CreateNewSLIForm({ apName, applicationId, apDefaultBoundaryScope, close, sliConfig }) {
  const timeConfig = useTimeConfig();
  const [form, setForm] = useState(createForm(sliConfig ?? {}, applicationId, apDefaultBoundaryScope));
  const [state, setState] = useState({
    success: false,
    saving: false,
    error: false
  });

  const { saving } = state;

  const onChange = (path, fn) => {
    setForm(form.updateIn(path, fn));
  };

  const onChangeType = sliType => {
    resetFormForSliType(sliType, setForm, form);
  };

  const onSubmit = form => {
    setState({
      saving: true,
      success: false,
      error: false
    });

    const pureConfig = toBackendFormat(form);
    const enrichedSliConfiguration = {
      ...pureConfig,
      id: generateUniqueShortId(9)
    };

    if (form.hierarchyValid) {
      const createSliConfigResult$ = createSliConfiguration(enrichedSliConfiguration);
      createSliConfigResult$.once(
        () => {
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
          if (pureConfig.id) {
            trackSLICloned({ sliType: enrichedSliConfiguration.sliEntity?.sliType });
          } else {
            trackSliNewCreated({ sliType: enrichedSliConfiguration.sliEntity?.sliType });
          }
          close();
        },
        () => {
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
          setState({
            error: true
          });
        }
      );
    }
  };

  const savingStateName = sliConfig?.id
    ? t('in-custom-dashboards:widgets.slo.createSliForm.cloning')
    : t('in-custom-dashboards:widgets.slo.createSliForm.creating');
  const saveButtonLabel = sliConfig?.id
    ? t('in-custom-dashboards:widgets.slo.createSliForm.clone')
    : t('in-custom-dashboards:widgets.slo.createSliForm.create');
  const isValid = useValidateExpressions(form, timeConfig);

  return (
    <Form form={form} setForm={setForm} onSubmit={onSubmit}>
      <Stack space="large">
        <SliForm form={form} onChange={onChange} onChangeType={onChangeType} apName={apName} />

        {sliConfig?.id && <Message>{t('in-custom-dashboards:widgets.slo.createSliForm.sliConfigMsg')}</Message>}

        {state?.errors && <ErroneousResultPresenter errors={state.errors} />}

        <FormFooter withRoundedBottomBorder>
          <CancelButton
            onClick={() => {
              const sliEntityForm = form.get('sliEntity');
              const sliType = sliEntityForm?.get('sliType')?.value;
              trackSLIEditAbort({ sliId: sliConfig?.id, sliType });
              close();
            }}
          />
          <SaveButton form={form} isSaving={saving} disabled={!isValid}>
            {saving ? savingStateName : saveButtonLabel}
          </SaveButton>
        </FormFooter>
      </Stack>
    </Form>
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

function useValidateExpressions(form, timeConfig) {
  const sliEntityForm = form.get('sliEntity');
  const sliType = sliEntityForm?.get('sliType')?.value;
  const goodEventFilterExpression = sliEntityForm?.get(sliFieldNames.goodEventFilterExpression)?.value;
  const badEventFilterExpression = sliEntityForm?.get(sliFieldNames.badEventFilterExpression)?.value;

  // Only availability SLIs use query builder, and therefore only these need to be validated
  const requiresQueryValidation = sliType === 'availability';

  const goodEventsValidationResult = useValidateExpression(goodEventFilterExpression);
  const badEventsValidationResult = useValidateExpression(badEventFilterExpression);
  return Boolean(goodEventsValidationResult?.data) && Boolean(badEventsValidationResult?.data);

  function useValidateExpression(tagFilterExpression) {
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
}
