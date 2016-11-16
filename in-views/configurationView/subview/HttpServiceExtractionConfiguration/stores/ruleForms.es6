import {ListForm, MapForm, Field} from 'in-services/form';
import {generateUniqueShortId} from 'in-services/util/id';
import {createStore} from 'in-stores/store';

const ruleFormsStore = createStore({
  name: 'in-views/configurationView/subview/HttpServiceExtractionConfiguration/stores/ruleForms',
  initialValue: new ListForm()
});
export const ruleForms$ = ruleFormsStore.observable;


export function addNewRule(id) {
  const ruleForm = new MapForm()
    .addItem('id', new Field(id || generateUniqueShortId()))
    .addItem('name', new Field('New Service Rule'))
    .addItem('enabled', new Field(false))
    .addItem('comment', new Field(''))
    .addItem('matchSpecification', new MapForm(atLeastOneMatchSpecificationRule))
    .addItem('label', new Field('Unnamed service'));

  ruleFormsStore.applyStateMutation(ruleForms => ruleForms.addItem(ruleForms.length, ruleForm));
}


export function addMatchSpecification(rulePath, matchName, initialValue) {
  const path = [...rulePath, 'matchSpecification', matchName];
  const field = new Field(initialValue, matchSpecificationMustCompileRule);
  ruleFormsStore.applyStateMutation(ruleForms => ruleForms.addItem(path, field));
}


export function removeMatchSpecification(rulePath, matchName) {
  const path = [...rulePath, 'matchSpecification', matchName];
  ruleFormsStore.applyStateMutation(ruleForms => ruleForms.removeItem(path));
}


export function setValue(path, value) {
  ruleFormsStore.applyStateMutation(ruleForms => ruleForms.setValue(path, value));
}


export function moveRuleUp(path) {
  ruleFormsStore.applyStateMutation(ruleForms => ruleForms.moveUp(path));
}


export function moveRuleDown(path) {
  ruleFormsStore.applyStateMutation(ruleForms => ruleForms.moveDown(path));
}


export function removeRule(path) {
  ruleFormsStore.applyStateMutation(ruleForms => ruleForms.removeItem(path));
}


function atLeastOneMatchSpecificationRule(mapForm) {
  if (mapForm.keys().length === 0) {
    return 'At least one match expression is required.';
  }
  return null;
}


function matchSpecificationMustCompileRule(regex) {
  try {
    /* eslint-disable no-new */
    new RegExp(regex);
    /* eslint-enable no-new */
    return null;
  } catch (e) {
    return e.message;
  }
}
