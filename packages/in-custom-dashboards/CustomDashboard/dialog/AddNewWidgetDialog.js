import { createMapForm, createField, notBlankValidator } from 'formalistic';
import { compose, withState, withProps } from 'recompose';
import React from 'react';

import WidgetConfiguratorPresenter from 'in-custom-dashboards/CustomDashboard/dialog/steps/WidgetConfiguratorPresenter';
import WidgetSelectorPresenter from 'in-custom-dashboards/CustomDashboard/dialog/steps/WidgetSelectorPresenter';
import StepProgressBar from 'in-new-components/StepProgressBar/StepProgressBar';
import BigHeaderDialog from 'in-new-components/BigHeaderDialog/BigHeaderDialog';
import { generateUniqueShortId } from 'in-services/util/id';
import { close } from 'in-components/DialogPresenter/store';
import Button from 'in-new-components/Button/Button';
import widgets from 'in-custom-dashboards/widgets';
import { isBlank } from 'in-services/util/string';

import locals from './AddNewWidgetDialog.mless';

export default compose(
  withProps(({ widget }) => ({
    editMode: widget != null
  })),
  withState('form', 'setForm', ({ widget }) => getInitialFormState(widget)),
  withState('step', 'setStep', ({ editMode }) => (editMode ? 1 : 0)),
  withProps(({ form, setForm, step, setStep, onSave }) => ({
    widget: isBlank(form.get('type').value) ? null : widgets[form.get('type').value],
    onSubmit: e => {
      e.preventDefault();

      if (step === 0) {
        if (!form.get('type').valid) {
          setForm(form.setTouched(true, { recurse: true }));
        } else {
          setStep(step + 1);
        }
        return;
      }

      if (!form.hierarchyValid) {
        setForm(form.setTouched(true, { recurse: true }));
        return;
      }
      onSave(form.toJS());
      close();
    },
    onChange: (path, fn) => setForm(form.updateIn(path, fn))
  }))
)(AddNewWidgetDialog);

function AddNewWidgetDialog({ onSubmit, step, setStep, form, setForm, editMode, onChange, widget }) {
  return (
    <BigHeaderDialog title="Widget Configuration" titleIconType="lib_views_grid" onClose={close}>
      <form onSubmit={onSubmit} className={locals.dialog}>
        <StepProgressBar step={step} stepTitles={['Step 1: Select Widget Type', 'Step 2: Configure Widget']} />
        {step === 0 && <WidgetSelectorPresenter form={form} setForm={setForm} />}
        {step === 1 && <WidgetConfiguratorPresenter form={form} onChange={onChange} widget={widget} />}

        <nav className={locals.controls}>
          <Button className={locals.button} kind="secondary" onClick={() => (step === 0 ? close() : setStep(step - 1))}>
            {step === 0 ? 'Cancel' : 'Back'}
          </Button>
          <Button
            type="submit"
            kind="primaryv2"
            className={locals.button}
            disabled={form.touched && !form.hierarchyValid}
          >
            {step === 1 ? (editMode ? 'Save' : 'Create') : 'Next'}
          </Button>
        </nav>
      </form>
    </BigHeaderDialog>
  );
}

function getInitialFormState(widget) {
  let form = createMapForm()
    .put(
      'id',
      createField({
        value: widget ? widget.id : generateUniqueShortId()
      })
    )
    .put(
      'width',
      createField({
        value: widget ? widget.width : 1
      })
    )
    .put(
      'height',
      createField({
        value: widget ? widget.height : 1
      })
    )
    .put(
      'x',
      createField({
        value: widget ? widget.x : 1
      })
    )
    .put(
      'y',
      createField({
        value: widget ? widget.y : 1
      })
    )
    .put(
      'type',
      createField({
        value: widget ? widget.type : null,
        validator: notBlankValidator
      })
    )
    .put(
      'title',
      createField({
        value: widget ? widget.title : null,
        validator: notBlankValidator
      })
    );

  if (widget) {
    form = form.put('config', widgets[widget.type].createForm(widget.config));
  }

  return form;
}
