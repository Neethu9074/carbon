import { createField, createMapForm, notBlankValidator } from 'formalistic';
import { compose, withProps } from 'recompose';
import { empty } from '@instana/observables';

import EditGroupDialogPresenter from 'in-analyze/components/EditGroupDialog/EditGroupDialogPresenter';
import { getTagType, getTagEntity, getSourceEntityAvailability } from 'in-applications/tags';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import withPropDependingState from 'in-hoc/withPropDependingState';
import { close } from 'in-components/DialogPresenter/store';
import { compareIgnoreCase } from 'in-services/util/string';
import { entityTypes } from 'in-analyze/applicationFilter';
import { emptyArray } from 'in-services/fixedObjects';
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
  withProps(({ setGroup, setForm, form, timeConfig, forAnalyzeCalls }) => ({
    tagEntity: getTagEntity(form.get('tag').value),
    sourceEntityAvailability: getSourceEntityAvailability(form.get('tag').value, timeConfig),
    onClose: close,
    onTagChange: tag => setForm(createForm(tag, null, forAnalyzeCalls)),
    onKeyChange: key => setForm(form.updateIn(['key'], f => f.setValue(key).setTouched(true))),
    onEntityChange: entity => setForm(form.updateIn(['entity'], f => f.setValue(entity).setTouched(true))),
    onSubmit: e => {
      const tagEntity = getTagEntity(form.get('tag').value);

      stopPropagationAndPreventDefault(e);
      if (!form.hierarchyValid) {
        setForm(form.setTouched(true, { recurse: true }));
        return;
      }

      const newGroup = {
        groupbyTag: form.get('tag').value
      };

      newGroup.entity =
        tagEntity === entityTypes.NOT_APPLICABLE
          ? entityTypes.NOT_APPLICABLE
          : form.containsKey('entity') && form.get('entity').value;

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
    form,
    tagName: form.get('tag').value
  };
}

function setResolvedEntity(tag) {
  const tagEntity = getTagEntity(tag);
  if (tagEntity === entityTypes.NOT_APPLICABLE) {
    return entityTypes.NOT_APPLICABLE;
  } else if (tagEntity === entityTypes.SOURCE) {
    return entityTypes.SOURCE;
  }
  return entityTypes.DESTINATION;
}

function createForm(tag, group) {
  const resolvedTag = (group && group.groupbyTag) || (group && group.name) || tag;
  const tagType = getTagType(resolvedTag);
  const resolvedEntity = group ? group.entity : setResolvedEntity(tag);

  let form = createMapForm()
    .put(
      'tag',
      createField({
        value: resolvedTag,
        validator: notBlankValidator
      })
    )
    .put(
      'entity',
      createField({
        value: resolvedEntity
      })
    );

  if (tagType === 'KEY_VALUE_PAIR') {
    form = form.put(
      'key',
      createField({
        value: (group && group.groupbyTagSecondLevelKey) || ''
      })
    );
  }

  return form;
}
