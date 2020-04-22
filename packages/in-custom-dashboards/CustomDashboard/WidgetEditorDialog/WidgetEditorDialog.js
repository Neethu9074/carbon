import { createMapForm, createField, notBlankValidator } from 'formalistic';
import { compose, withState, withProps } from 'recompose';

import WidgetEditorDialogPresenter from 'in-custom-dashboards/CustomDashboard/WidgetEditorDialog/WidgetEditorDialogPresenter';
import { stringValidator, numberValidator } from 'in-services/validators/jsonType';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { type as defaultType } from 'in-custom-dashboards/widgets/BigNumber';
import { notUndefinedValidator } from 'in-services/validators/undefined';
import { buildEnumValidator } from 'in-services/validators/enum';
import { close } from 'in-components/DialogPresenter/store';
import { generateUniqueShortId } from 'in-services/util/id';
import widgets, { enabledWidgets } from 'in-custom-dashboards/widgets';

export default compose(
  withState('form', 'setForm', ({ widget }) => getInitialFormState(widget)),
  withProps(({ form, setForm, onSubmit, widget }) => ({
    isEditing: widget != null,
    onChange: (path, fn) => setForm(form.updateIn(path, fn)),
    onChangeType: type => {
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
    },
    onSubmit: () => {
      if (!form.hierarchyValid) {
        setForm(form.setTouched(true, { recurse: true }));
        return;
      }

      onSubmit(form.toJS());
      close();
    }
  }))
)(WidgetEditorDialogPresenter);

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
        validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator)
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
