import {createLogger} from 'instalog';

import {saveNewFilter, saveFilter} from 'in-services/groundskeeper/filters';
import {refresh} from 'in-components/SearchBar/stores/filters';
import {close} from 'in-components/DialogPresenter/store';
import MapForm from 'in-services/form/MapForm';
import {createStore} from 'in-stores/store';
import Field from 'in-services/form/Field';

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
  const form = new MapForm()
    .addItem('id', new Field(id))
    .addItem('name', new Field(name, validateName))
    .addItem('definition', new Field(definition, validateDefinition));
  formStore.mutateTo(form);
}


export function setValue(prop, value) {
  formStore.applyStateMutation(form => form.setValue(prop, value));
}


export function save() {
  form$.once(form => {
    const id = form.getItem('id').value;
    const name = form.getItem('name').value;
    const definition = form.getItem('definition').value;

    let result$;
    if (id) {
      result$ = saveFilter(id, name, definition);
    } else {
      result$ = saveNewFilter(name, definition);
    }

    result$.once(() => {
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
    return 'Please specify a name for the filter.';
  }
  return null;
}


function validateDefinition(s) {
  if (!s || s.trim().length === 0) {
    return 'Please specify a filter to save.';
  }
  return null;
}
