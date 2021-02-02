/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { just } from '@instana/observables';
import React, { useState } from 'react';

import { trackSliNewCreated, trackSLICloned, trackSLIEditAbort } from 'in-custom-dashboards/widgets/Slo/tracker';
import { resetFormForSliType, createForm, sliFieldNames } from 'in-custom-dashboards/widgets/Slo/sli/sliForm';
import { switchQB1orQB2Helper, isQB2ModeEnabled } from 'in-new-components/Alerting/components/WithQB1orQB2';
import { toBackendQueryModel } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import { isSliEventsQueryValid } from 'in-custom-dashboards/widgets/Slo/sli/SliEventsQueryBuilder';
import FormFooter, { SaveButton, CancelButton } from 'in-components/form/FormFooter/FormFooter';
import ErroneousResultPresenter from 'in-new-components/Errors/ErroneousResultPresenter';
import { SliForm } from 'in-custom-dashboards/widgets/Slo/sli/SliFormPresenter';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { createSliConfiguration } from 'in-custom-dashboards/api';
import { generateUniqueShortId } from 'in-services/util/id';
import { pendingResult } from 'in-services/fixedObjects';
import Stack from 'in-new-components/layout/Stack';
import Form from 'in-components/form/binding/Form';
import useObservable from 'in-hooks/useObservable';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { success } from 'in-services/util/result';
import Message from 'in-new-components/Message';

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
              title: 'SLI created successfully',
              content: `SLI "${enrichedSliConfiguration.sliName}" has been created.`
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
              title: 'Failed to create the SLI.',
              content: `There was a problem creating this SLI: "${enrichedSliConfiguration.sliName}"`
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

  const savingStateName = sliConfig?.id ? 'Cloning…' : 'Creating…';
  const saveButtonLabel = sliConfig?.id ? 'Clone' : 'Create';
  const isValid = useValidateExpressions(form, timeConfig);

  return (
    <Form form={form} setForm={setForm} onSubmit={onSubmit}>
      <Stack space="large">
        <SliForm form={form} onChange={onChange} onChangeType={onChangeType} apName={apName} />

        {sliConfig?.id && (
          <Message>
            The parameters of the SLI cannot be modified to prevent invalidation of the calculated spent budgets. This
            is why the SLI needs to be cloned when you change any parameter.
          </Message>
        )}

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
  return switchQB1orQB2Helper(
    () => {
      const formData = form.toJS();
      delete formData.sliEntity[sliFieldNames.goodEventFilterExpression];
      delete formData.sliEntity[sliFieldNames.badEventFilterExpression];
      return formData;
    },
    () => {
      const formData = form.toJS();
      const goodEvents = formData.sliEntity[sliFieldNames.goodEventFilterExpression];
      const badEvents = formData.sliEntity[sliFieldNames.badEventFilterExpression];
      delete formData.sliEntity.goodEventFilters;
      delete formData.sliEntity.badEventFilters;
      formData.sliEntity[sliFieldNames.goodEventFilterExpression] = toBackendQueryModel(goodEvents);
      formData.sliEntity[sliFieldNames.badEventFilterExpression] = toBackendQueryModel(badEvents);
      return formData;
    }
  );
}

function useValidateExpressions(form, timeConfig) {
  const sliEntityForm = form.get('sliEntity');
  const sliType = sliEntityForm?.get('sliType')?.value;
  const goodEventFilterExpression = sliEntityForm?.get(sliFieldNames.goodEventFilterExpression)?.value;
  const badEventFilterExpression = sliEntityForm?.get(sliFieldNames.badEventFilterExpression)?.value;
  const isSliTypeUsingQB2 = sliType === 'availability';
  const requiresQueryValidation = isQB2ModeEnabled && isSliTypeUsingQB2;

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
