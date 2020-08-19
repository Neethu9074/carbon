import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { resetFormForSliType, createForm } from 'in-custom-dashboards/widgets/Slo/form/sliForm';
import { SliForm } from 'in-custom-dashboards/widgets/Slo/SliFormPresenter';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { createSliConfiguration } from 'in-custom-dashboards/api';
import Button from 'in-new-components/Button';

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

    const newSliId = apName + '-' + uuidv4().slice(8);
    const enrichtedSliConfiguration = {
      id: newSliId, // e.g. 'appname-1b9d6bcd'
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
      <div>
        <Button kind="subtle" size="compact" onClick={close}>
          cancel
        </Button>
        {form && (
          <Button
            icon={saving ? 'lib_actions_loading' : null}
            iconSpinning
            kind="create"
            type="submit"
            disabled={(!form.hierarchyValid && form.touched) || saving}
          >
            {saving ? savingStateName : saveButtonLabel}
          </Button>
        )}
      </div>
    </form>
  );
}
