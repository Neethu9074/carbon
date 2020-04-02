import { createMapForm, createField, notBlankValidator } from 'formalistic';
import { compose, withState, withProps } from 'recompose';

import WidgetEditorDialogPresenter from 'in-custom-dashboards/CustomDashboard/WidgetEditorDialog/WidgetEditorDialogPresenter';
import { type as defaultType } from 'in-custom-dashboards/widgets/BigNumber';
import { close } from 'in-components/DialogPresenter/store';
import { generateUniqueShortId } from 'in-services/util/id';
import widgets from 'in-custom-dashboards/widgets';

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

function getInitialFormState(widget) {
  const type = widget?.type ?? defaultType;

  return createMapForm()
    .put(
      'id',
      createField({
        value: widget?.id ?? generateUniqueShortId()
      })
    )
    .put(
      'width',
      createField({
        value: widget?.width ?? 1
      })
    )
    .put(
      'height',
      createField({
        value: widget?.height ?? 1
      })
    )
    .put(
      'x',
      createField({
        value: widget?.x ?? 0
      })
    )
    .put(
      'y',
      createField({
        value: widget?.y ?? 0
      })
    )
    .put(
      'title',
      createField({
        value: widget?.title ?? '',
        validator: notBlankValidator
      })
    )
    .put(
      'type',
      createField({
        value: type,
        validator: notBlankValidator
      })
    )
    .put('config', widgets[type].createForm(widget?.config));
}
