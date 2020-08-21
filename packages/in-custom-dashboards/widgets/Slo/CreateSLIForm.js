import React, { Fragment, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { resetFormForSliType, createForm } from 'in-custom-dashboards/widgets/Slo/form/sliForm';
import { SliForm } from 'in-custom-dashboards/widgets/Slo/SliFormPresenter';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { createSliConfiguration } from 'in-custom-dashboards/api';
import SectionLine from 'in-settings/components/SectionLine';
import Section from 'in-settings/components/Section';
import Button from 'in-new-components/Button';

import locals from './CreateSLIForm.mless';

export default function CreateNewSLIForm({ api, apName, applicationId, close, sliConfig }) {
  const [form, setForm] = useState(createForm(sliConfig ?? {}, applicationId));

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

    const newSliId = uuidv4().slice(8);
    const enrichtedSliConfiguration = {
      id: newSliId,
      ...form.toJS()
    };
    createSliConfiguration(enrichtedSliConfiguration).subscribe(result => {
      if (result.progress.loading) {
        setState({
          success: false,
          saving: true,
          error: false
        });
      }
      if (result.errors.length > 0) {
        setState({
          success: false,
          saving: false,
          error: true
        });
        addMessage(
          {
            type: 'danger',
            timeout: 3000,
            content: 'Failed to create the sli.'
          },
          'custom-dashboard-error'
        );
      } else {
        close();
      }
    });
  };

  const savingStateName = sliConfig?.id ? 'Cloning' : 'Creating…';
  const saveButtonLabel = sliConfig?.id ? 'Clone' : 'Create';

  return (
    <form onSubmit={e => onSubmit(e, form, setForm)}>
      <SliForm form={form} onChange={onChange} onChangeType={onChangeType} apName={apName} api={api} />
      <Fragment>
        <Section className={locals.line}>
          <SectionLine withMarginBottom={false} />
        </Section>
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
      </Fragment>
    </form>
  );
}
