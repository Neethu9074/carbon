import React, { useState } from 'react';

import { resetFormForSliType, createForm } from 'in-custom-dashboards/widgets/Slo/form/sliForm';
import ErroneousResultPresenter from 'in-new-components/Errors/ErroneousResultPresenter';
import { SliForm } from 'in-custom-dashboards/widgets/Slo/SliFormPresenter';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { createSliConfiguration } from 'in-custom-dashboards/api';
import { generateUniqueShortId } from 'in-services/util/id';
import Section from 'in-settings/components/Section';
import Message from 'in-new-components/Message';
import Button from 'in-new-components/Button';

import locals from './CreateSLIForm.mless';

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

  const onSubmit = (e, form, updateForm) => {
    e.preventDefault();

    if (!form.hierarchyValid) {
      updateForm(form.setTouched(true, { recurse: true }));
      return;
    }

    setState({
      saving: true,
      success: false,
      error: false
    });

    const enrichedSliConfiguration = {
      ...form.toJS(),
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
        () =>
          addMessage(
            {
              type: 'danger',
              timeout: 4000,
              title: 'Failed to create the SLI.',
              content: `There was a problem creating this SLI: "${enrichedSliConfiguration.sliName}"`
            },
            'custom-dashboard-error'
          )
      );
    }
  };

  const savingStateName = sliConfig?.id ? 'Cloning…' : 'Creating…';
  const saveButtonLabel = sliConfig?.id ? 'Clone' : 'Create';

  return (
    <form onSubmit={e => onSubmit(e, form, setForm)}>
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
    </form>
  );
}
