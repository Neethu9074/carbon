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
  withProps(({ form, setForm, step, setStep, onSave }) => {
    let stepValid = false;
    if (step === 0) {
      stepValid = form.get('type').valid;
    } else {
      stepValid = form.hierarchyValid;
    }

    return {
      stepValid: stepValid,
      widget: isBlank(form.get('type').value) ? null : widgets[form.get('type').value],
      onSubmit: e => {
        e.preventDefault();

        if (step === 0) {
          if (!stepValid) {
            setForm(form.updateIn(['type'], f => f.setTouched(true)));
          } else {
            setForm(reinitializeConfigSegment(form).setTouched(false, { recurse: true }));
            setStep(step + 1);
          }
          return;
        }

        if (!stepValid) {
          setForm(form.setTouched(true, { recurse: true }));
        } else {
          onSave(form.toJS());
          close();
        }
      },
      onChange: (path, fn) => setForm(form.updateIn(path, fn))
    };
  })
)(AddNewWidgetDialog);

function AddNewWidgetDialog({ onSubmit, step, setStep, form, setForm, editMode, onChange, widget, stepValid }) {
  return (
    <BigHeaderDialog title="Widget Configuration" titleIconType="lib_views_grid" onClose={close}>
      <form onSubmit={onSubmit} className={locals.dialog}>
        <StepProgressBar step={step} stepTitles={['Step 1: Select Widget Type', 'Step 2: Configure Widget']} />

        <div className={locals.steps}>
          {step === 0 && <WidgetSelectorPresenter form={form} setForm={setForm} onChange={onChange} />}
          {step === 1 && <WidgetConfiguratorPresenter form={form} onChange={onChange} widget={widget} />}
        </div>

        <nav className={locals.controls}>
          <Button className={locals.button} kind="secondary" onClick={() => (step === 0 ? close() : setStep(step - 1))}>
            {step === 0 ? 'Cancel' : 'Back'}
          </Button>
          <Button type="submit" kind="primaryv2" className={locals.button} disabled={form.touched && !stepValid}>
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
        value: widget ? widget.x : 0
      })
    )
    .put(
      'y',
      createField({
        value: widget ? widget.y : 0
      })
    )
    .put(
      'type',
      createField({
        value: widget ? widget.type : '',
        validator: notBlankValidator
      })
    )
    .put(
      'configType',
      createField({
        value: widget ? widget.type : '',
        validator: notBlankValidator
      })
    )
    .put(
      'title',
      createField({
        value: widget ? widget.title : '',
        validator: notBlankValidator
      })
    );

  if (widget) {
    form = form.put('config', widgets[widget.type].createForm(widget.config));
  }

  return form;
}

function reinitializeConfigSegment(form) {
  const newType = form.get('type').value;
  const oldType = form.get('configType').value;

  if (newType !== oldType) {
    form = form
      .put(
        'configType',
        createField({
          value: newType
        })
      )
      .put('config', widgets[newType].createForm());
  }

  return form;
}
