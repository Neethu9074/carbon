import {getServiceExtractionConfig, saveServiceExtractionConfig} from 'in-services/groundskeeper/serviceExtraction';
import {addMessage, removeMessage} from 'in-components/MessageFlyout/stores/messages';
import {ListForm, MapForm, Field} from 'in-services/form';
import {generateUniqueShortId} from 'in-services/util/id';
import {createStore} from 'in-stores/store';

const ruleType = 'webapp';
const ruleMessageId = 'config-view-webapp-rules';

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


export function removeAllRules() {
  ruleFormsStore.mutateTo(new ListForm());
}


export function enable() {
  removeAllRules();
  loadRules();
}


export function disable() {
  removeAllRules();
}


function loadRules() {
  addMessage({
    type: 'info',
    icon: 'ok',
    content: 'Loading rules…'
  }, ruleMessageId);

  const loadedRuleForms$ = getServiceExtractionConfig(ruleType)
    .map(createRuleForms);

  loadedRuleForms$
    .once(ruleForms => {
      ruleFormsStore.mutateTo(ruleForms);
      removeMessage(ruleMessageId);
    });

  loadedRuleForms$
    .errors()
    .once(error => {
      addMessage({
        type: 'danger',
        icon: 'ok',
        content: 'Failed to load rules.'
      }, ruleMessageId);

      console.error({error});
    });
}


function createRuleForms(rules) {
  let ruleForms = new ListForm();

  rules.forEach((rule, i) => {
    let matchSpecificationForm = new MapForm(atLeastOneMatchSpecificationRule);

    Object.keys(rule.matchSpecification).forEach(matchKey => {
      matchSpecificationForm = matchSpecificationForm
        .addItem(matchKey, new Field(rule.matchSpecification[matchKey], matchSpecificationMustCompileRule));
    });

    const ruleForm = new MapForm()
      .addItem('id', new Field(rule.id))
      .addItem('name', new Field(rule.name))
      .addItem('enabled', new Field(rule.enabled))
      .addItem('comment', new Field(rule.comment))
      .addItem('matchSpecification', matchSpecificationForm)
      .addItem('label', new Field(rule.extractSpecification.label || ''));
    ruleForms = ruleForms.addItem(i, ruleForm);
  });

  return ruleForms;
}


export function saveRules(ruleForms) {
  addMessage({
    type: 'info',
    icon: 'ok',
    content: 'Saving rules…'
  }, ruleMessageId);

  const rules = createRulesFromRuleForms(ruleForms);
  const saveResult$ = saveServiceExtractionConfig(rules);

  saveResult$.once(() => {
    addMessage({
      type: 'info',
      icon: 'ok',
      content: 'Great success!'
    }, ruleMessageId);
  });

  saveResult$.errors().once(() => {
    addMessage({
      type: 'info',
      icon: 'ok',
      content: 'Saving failed!'
    }, ruleMessageId);
  });
}


function createRulesFromRuleForms(ruleForms) {
  return ruleForms.map((ruleForm, i) => {
    const matchSpecification = {};
    ruleForm.getItem('matchSpecification').forEach((field, key) => {
      matchSpecification[key] = field.value;
    });
    return {
      id: ruleForm.getItem('id').value,
      name: ruleForm.getItem('name').value,
      enabled: ruleForm.getItem('enabled').value,
      comment: ruleForm.getItem('comment').value,
      order: i,
      type: ruleType,
      parent: null,
      matchSpecification,
      extractSpecification: {
        label: ruleForm.getItem('label').value
      }
    };
  });
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
