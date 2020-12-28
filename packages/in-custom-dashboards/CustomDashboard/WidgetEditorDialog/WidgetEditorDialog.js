import { createMapForm, createField, notBlankValidator } from 'formalistic';
import React, { useState } from 'react';

import WidgetEditorDialogPresenter from 'in-custom-dashboards/CustomDashboard/WidgetEditorDialog/WidgetEditorDialogPresenter';
import { stringValidator, numberValidator } from 'in-services/validators/jsonType';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { type as defaultType } from 'in-custom-dashboards/widgets/BigNumber';
import { notUndefinedValidator } from 'in-services/validators/undefined';
import widgets, { enabledWidgets } from 'in-custom-dashboards/widgets';
import { buildEnumValidator } from 'in-services/validators/enum';
import { close } from 'in-components/DialogPresenter/store';
import { generateUniqueShortId } from 'in-services/util/id';

export default function WidgetEditorDialog({ widget, onSubmit }) {
  const [form, setForm] = useState(getInitialFormState(widget));
  const [slideInView, setSlideInView] = useState(null);
  const [showWidgetSelector, setShowWidgetSelector] = useState(widget == null || !form.get('type').valid);

  return (
    <WidgetEditorDialogPresenter
      form={form}
      isEditing={widget != null}
      showWidgetSelector={showWidgetSelector}
      setShowWidgetSelector={setShowWidgetSelector}
      onChange={(path, fn) => setForm(form.updateIn(path, fn))}
      onChangeType={type => {
        if (type === form.get('type').value) {
          return;
        }

        setForm(
          form
            .updateIn(['type'], field => field.setValue(type).setTouched(true))
            .put('config', widgets[type].createForm())
            // Do not show any validation failures when switching the widget type.
            .setTouched(false, { recurse: true })
        );
      }}
      onSubmit={() => {
        if (showWidgetSelector) {
          if (form.get('type').valid) {
            setShowWidgetSelector(false);
          }
          return;
        }

        if (!form.hierarchyValid) {
          setForm(form.setTouched(true, { recurse: true }));
          return;
        }

        onSubmit(form.toJS());
        close();
      }}
      slideInView={slideInView}
      setSlideInView={setSlideInView}
    />
  );
}

export function getInitialFormState(widget) {
  const type = widget?.type ?? defaultType;
  let form = createMapForm()
    .put(
      'id',
      createField({
        value: widget?.id ?? generateUniqueShortId(),
        validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator)
      })
    )
    .put(
      'width',
      createField({
        value: widget?.width ?? 1,
        validator: composeAndShortCircuitOnError(notUndefinedValidator, numberValidator)
      })
    )
    .put(
      'height',
      createField({
        value: widget?.height ?? 1,
        validator: composeAndShortCircuitOnError(notUndefinedValidator, numberValidator)
      })
    )
    .put(
      'x',
      createField({
        value: widget?.x ?? 0,
        validator: composeAndShortCircuitOnError(notUndefinedValidator, numberValidator)
      })
    )
    .put(
      'y',
      createField({
        value: widget?.y ?? 0,
        validator: composeAndShortCircuitOnError(notUndefinedValidator, numberValidator)
      })
    )
    .put(
      'title',
      createField({
        value: widget?.title ?? '',
        validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator)
      })
    )
    .put(
      'type',
      createField({
        value: type,
        validator: composeAndShortCircuitOnError(
          notUndefinedValidator,
          stringValidator,
          buildEnumValidator(Object.keys(enabledWidgets))
        )
      })
    );

  if (form.get('type').valid) {
    form = form.put('config', widgets[form.get('type').value].createForm(widget?.config));
  }

  return form;
}
