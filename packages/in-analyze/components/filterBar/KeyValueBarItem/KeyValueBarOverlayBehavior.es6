import { createField, createMapForm, notBlankValidator } from 'formalistic';
import { compose, withState, withProps } from 'recompose';
import { timeout, empty } from 'reactive-observables';

import KeyValueBarOverlayPresenter from 'in-analyze/components/filterBar/KeyValueBarItem/KeyValueBarOverlayPresenter';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import { isBlank, compareIgnoreCase } from 'in-services/util/string';
import { emptyArray, pendingResult } from 'in-services/fixedObjects';
import connect from 'in-hoc/connectTo';

export default compose(
  withState('form', 'setForm', getEmptyForm()),
  withProps(({ form, setForm, addTagFilter, tag, close, tagFilters, setTagFilters }) => ({
    onKeyChange: key => setForm(form.updateIn(['key'], f => f.setValue(key).setTouched(true))),
    onValueChange: value => setForm(form.updateIn(['value'], f => f.setValue(value).setTouched(true))),
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
  })),
  connect((props, prevProps) => {
    let keySuggestions$;
    if (props.getKeySuggestions) {
      keySuggestions$ = props.getKeySuggestions({
        ...props
      });
    } else {
      keySuggestions$ = empty;
    }

    const key = props.form.get('key').value;
    const keyChanged = prevProps && prevProps.form && key !== prevProps.form.get('key').value;
    let valueSuggestions$;
    if (isBlank(key) || !props.getValueSuggestions) {
      valueSuggestions$ = empty;
    } else if (keyChanged) {
      valueSuggestions$ = timeout(1500)
        .flatMap(() =>
          props.getValueSuggestions({
            ...props,
            key
          })
        )
        .startWith(pendingResult);
    } else {
      valueSuggestions$ = props.getValueSuggestions({
        ...props,
        key
      });
    }

    return {
      keySuggestions: keySuggestions$
        .map(r => (r.data || emptyArray).slice().sort(compareIgnoreCase))
        .startWith(emptyArray),
      keySuggestionsLoading: keySuggestions$.map(r => r.progress.loading),
      valueSuggestions: valueSuggestions$
        .map(r => (r.data || emptyArray).slice().sort(compareIgnoreCase))
        .startWith(emptyArray),
      valueSuggestionsLoading: valueSuggestions$.map(r => r.progress.loading)
    };
  })
)(KeyValueBarOverlayPresenter);

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
