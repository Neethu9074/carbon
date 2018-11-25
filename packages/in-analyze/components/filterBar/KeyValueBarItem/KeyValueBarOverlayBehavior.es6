import { createField, createMapForm, notBlankValidator } from 'formalistic';
import { compose, withState, withProps } from 'recompose';

import KeyValueBarOverlayPresenter from 'in-analyze/components/filterBar/KeyValueBarItem/KeyValueBarOverlayPresenter';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';

export default compose(
  withState('form', 'setForm', getEmptyForm()),
  withProps(({ form, setForm, addTagFilter, tag, close, tagFilters, setTagFilters }) => ({
    onKeyChange: e => setForm(form.updateIn(['key'], f => f.setValue(e.target.value).setTouched(true))),
    onValueChange: e => setForm(form.updateIn(['value'], f => f.setValue(e.target.value).setTouched(true))),
    onOperatorChange: e => setForm(form.updateIn(['operator'], f => f.setValue(e.target.value).setTouched(true))),
    onSubmit(e) {
      stopPropagationAndPreventDefault(e);
      if (!form.hierarchyValid) {
        setForm({
          form: form.setTouched(true, {
            recurse: true
          })
        });
        return;
      }

      addTagFilter({
        name: tag,
        operator: form.get('operator').value,
        stringValue: `${form.get('key').value}=${form.get('value').value}`
      });
      close();
    },
    onRemoveTagFilter(tagFilter) {
      setTagFilters(tagFilters.filter(f => f !== tagFilter));
    }
  }))
)(KeyValueBarOverlayPresenter);

// keySuggestionsLoading={boolean('Keys loading?', false)}
// valueSuggestionsLoading={boolean('Values loading?', false)}

function getEmptyForm() {
  return createMapForm()
    .put(
      'key',
      createField({
        validator: notBlankValidator
      })
    )
    .put(
      'value',
      createField({
        validator: notBlankValidator
      })
    )
    .put(
      'operator',
      createField({
        value: 'EQUALS',
        validator: notBlankValidator
      })
    );
}
