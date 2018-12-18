import { createField, createMapForm, notBlankValidator } from 'formalistic';
import { compose, withProps } from 'recompose';
import { empty } from 'reactive-observables';

import EditGroupDialogPresenter from 'in-analyze/components/EditGroupDialog/EditGroupDialogPresenter';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import withPropDependingState from 'in-hoc/withPropDependingState';
import { close } from 'in-components/DialogPresenter/store';
import { compareIgnoreCase } from 'in-services/util/string';
import { emptyArray } from 'in-services/fixedObjects';
import { getTagType } from 'in-applications/tags';
import connect from 'in-hoc/connectTo';

export default compose(
  withPropDependingState({
    getInitialState,
    resets: [
      {
        getResettingProps: () => ['group'],
        onReset: getInitialState
      }
    ],
    reducerName: 'setForm',
    reducer: (prev, form) => getState(form)
  }),
  withProps(({ setGroup, setForm, form }) => ({
    onClose: close,
    onTagChange: tag => setForm(createForm(tag)),
    onKeyChange: key => setForm(form.updateIn(['key'], f => f.setValue(key).setTouched(true))),
    onSubmit: e => {
      stopPropagationAndPreventDefault(e);
      if (!form.hierarchyValid) {
        setForm(form.setTouched(true, { recurse: true }));
        return;
      }

      const newGroup = {
        groupbyTag: form.get('tag').value
      };

      if (form.get('key')) {
        newGroup.groupbyTagSecondLevelKey = form.get('key').value;
      }

      setGroup(newGroup);
      close();
    }
  })),
  connect(props => {
    let keySuggestions$;
    if (props.form.get('key') != null && props.getKeySuggestions) {
      keySuggestions$ = props.getKeySuggestions({
        ...props,
        key: props.form.get('key').value,
        tag: props.form.get('tag').value
      });
    } else {
      keySuggestions$ = empty;
    }

    return {
      keySuggestions: keySuggestions$
        .map(r => (r.data || emptyArray).slice().sort(compareIgnoreCase))
        .startWith(emptyArray),
      keySuggestionsLoading: keySuggestions$.map(r => r.progress.loading)
    };
  })
)(EditGroupDialogPresenter);

function getInitialState({ tagSuggestions, group }) {
  return getState(createForm(tagSuggestions[0], group));
}

function getState(form) {
  return {
    form
  };
}

function createForm(tag, group) {
  const resolvedTag = (group && group.groupbyTag) || (group && group.name) || tag;
  const tagType = getTagType(resolvedTag);

  let form = createMapForm().put(
    'tag',
    createField({
      value: resolvedTag,
      validator: notBlankValidator
    })
  );

  if (tagType === 'KEY_VALUE_PAIR') {
    form = form.put(
      'key',
      createField({
        value: (group && group.groupbyTagSecondLevelKey) || '',
        validator: notBlankValidator
      })
    );
  }

  return form;
}
