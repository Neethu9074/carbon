import { DFQ_FILTER_SAVED, DFQ_FILTER_EDITED } from 'in-services/tracking/eventNames';
import { refresh } from 'in-components/SearchBar/stores/filters';
import { close } from 'in-components/DialogPresenter/store';
import { saveNewFilter, saveFilter } from 'in-api/filters';
import { createMapForm, createField } from 'formalistic';
import { track } from 'in-services/tracking/tracking';
import { createStore } from 'in-stores/store';
import { createLogger } from 'instalog';

const logger = createLogger('SearchBar/stores/dialog');

const formStore = createStore({
  name: 'in-components/SearchBar/stores/dialog/form',
  initialValue: null
});
export const form$ = formStore.observable;

const errorStore = createStore({
  name: 'in-components/SearchBar/stores/dialog/error',
  initialValue: null
});
export const error$ = errorStore.observable;

clear();

function clear() {
  setValues('', '', '');
}

export function setValues(id, name, definition) {
  const form = createMapForm()
    .put(
      'id',
      createField({
        value: id
      })
    )
    .put(
      'name',
      createField({
        value: name,
        validator: validateName
      })
    )
    .put(
      'definition',
      createField({
        value: definition,
        validator: validateDefinition
      })
    );
  formStore.mutateTo(form);
}

export function setValue(prop, value) {
  formStore.applyStateMutation(form => {
    return form.updateIn([prop], field => field.setValue(value).setTouched(true));
  });
}

export function save() {
  form$.once(form => {
    const id = form.get('id').value;
    const name = form.get('name').value;
    const definition = form.get('definition').value;

    let result$;
    if (id) {
      result$ = saveFilter(id, name, definition);
    } else {
      result$ = saveNewFilter(name, definition);
    }

    result$.once(() => {
      const trackingPayload = { name, query: definition };
      if (id) {
        track(DFQ_FILTER_EDITED, trackingPayload);
      } else {
        track(DFQ_FILTER_SAVED, trackingPayload);
      }
      errorStore.mutateTo(null);
      clear();
      refresh();
      close();
    });

    result$.errors().once(error => {
      logger.error(`Failed to save filter: ${error.message}`, error);
      errorStore.mutateTo('Failed to save filter.');
    });
  });
}

function validateName(s) {
  if (!s || s.trim().length === 0) {
    return [
      {
        severity: 'error',
        message: 'Please specify a name for the filter.'
      }
    ];
  }
  return null;
}

function validateDefinition(s) {
  if (!s || s.trim().length === 0) {
    return [
      {
        severity: 'error',
        message: 'Please specify a filter to save.'
      }
    ];
  }
  return null;
}
