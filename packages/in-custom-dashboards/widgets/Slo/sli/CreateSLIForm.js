import React, { useState } from 'react';

import { resetFormForSliType, createForm, sliFieldNames } from 'in-custom-dashboards/widgets/Slo/sli/sliForm';
import { toBackendQueryModel } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import { switchQB1orQB2Helper } from 'in-new-components/Alerting/components/WithQB1orQB2';
import ErroneousResultPresenter from 'in-new-components/Errors/ErroneousResultPresenter';
import { SliForm } from 'in-custom-dashboards/widgets/Slo/sli/SliFormPresenter';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { createSliConfiguration } from 'in-custom-dashboards/api';
import { generateUniqueShortId } from 'in-services/util/id';
import Section from 'in-settings/components/Section';
import Form from 'in-components/form/binding/Form';
import Message from 'in-new-components/Message';
import Button from 'in-new-components/Button';

import locals from 'in-custom-dashboards/widgets/Slo/sli/CreateSLIForm.mless';

export default function CreateNewSLIForm({ apName, applicationId, apDefaultBoundaryScope, close, sliConfig }) {
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

  const onSubmit = form => {
    setState({
      saving: true,
      success: false,
      error: false
    });

    const enrichedSliConfiguration = {
      ...toBackendFormat(form),
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

  return (
    <Form form={form} setForm={setForm} onSubmit={onSubmit}>
      <SliForm form={form} onChange={onChange} onChangeType={onChangeType} apName={apName} />
      {sliConfig?.id && (
        <Section>
          <Message>
            The parameters of the SLI cannot be modified to prevent invalidation of the calculated spent budgets. This
            is why the SLI needs to be cloned when you change any parameter.
          </Message>
        </Section>
      )}
      <Section>{state?.errors && <ErroneousResultPresenter errors={state.errors} />}</Section>
      <Section className={locals.saveCancelRow}>
        <Button kind="subtle" size="compact" className={locals.button} onClick={close}>
          Cancel
        </Button>
        {form && (
          <Button
            icon={saving ? 'lib_actions_loading' : null}
            iconSpinning
            className={locals.button}
            kind="create"
            type="submit"
            disabled={(!form.hierarchyValid && form.touched) || saving}
          >
            {saving ? savingStateName : saveButtonLabel}
          </Button>
        )}
      </Section>
    </Form>
  );
}
