import { createLogger } from 'instalog';
import React from 'react';

import {
  showNofitication,
  clearNotification
} from 'in-views/configurationView/subview/GenericServiceExtractionConfiguration/stores/notification';
import {
  LoadingRulesNotification,
  LoadingRulesFailedNotification,
  SavingRulesNotification,
  SavingRulesFailedNotification,
  SavingRulesSuccessfulNotification
} from 'in-views/configurationView/subview/GenericServiceExtractionConfiguration/components/Notifications';
import { getServiceExtractionConfig, savePartialServiceExtractionConfig } from 'in-services/api/serviceExtraction';
import { createField, createMapForm, createListForm } from 'formalistic';
import { generateUniqueShortId } from 'in-services/util/id';
import { createStore } from 'in-stores/store';

let ruleType;
const logger = createLogger('httpExtraction/ruleForms');

const ruleFormsStore = createStore({
  name: 'configurationView/subview/GenericServiceExtractionConfiguration/stores/ruleForms',
  initialValue: null
});
export const ruleForms$ = ruleFormsStore.observable;

export function addNewRule(id) {
  const ruleForm = createMapForm()
    .put('id', createField({ value: id || generateUniqueShortId() }))
    .put('name', createField({ value: 'New Service Rule' }))
    .put('enabled', createField({ value: false }))
    .put('comment', createField({ value: '' }))
    .put('matchSpecification', createMapForm({ validator: atLeastOneMatchSpecificationRule }))
    .put('label', createField({ value: 'Unnamed service' }));

  ruleFormsStore.applyStateMutation(ruleForms => ruleForms.push(ruleForm));
}

export function addMatchSpecification(rulePath, matchName, initialValue) {
  const path = [...rulePath, 'matchSpecification'];
  const field = createField({ value: initialValue, validator: matchSpecificationMustCompileRule });
  ruleFormsStore.applyStateMutation(ruleForms => ruleForms.updateIn(path, item => item.put(matchName, field)));
}

export function removeMatchSpecification(rulePath, matchName) {
  const path = [...rulePath, 'matchSpecification'];
  ruleFormsStore.applyStateMutation(ruleForms => ruleForms.updateIn(path, item => item.remove(matchName)));
}

export function setValue(path, value) {
  ruleFormsStore.applyStateMutation(ruleForms => ruleForms.updateIn(path, item => item.setValue(value)));
}

export function moveRuleUp(index) {
  ruleFormsStore.applyStateMutation(ruleForms => ruleForms.moveUp(Number(index)));
}

export function moveRuleDown(index) {
  ruleFormsStore.applyStateMutation(ruleForms => ruleForms.moveDown(Number(index)));
}

export function removeRule(index) {
  ruleFormsStore.applyStateMutation(ruleForms => ruleForms.remove(index));
}

export function removeAllRules() {
  ruleFormsStore.mutateTo(null);
}

export function enable(_ruleType) {
  ruleType = _ruleType;
  removeAllRules();
  loadRules();
}

export function disable() {
  removeAllRules();
}

function loadRules() {
  showNofitication({
    children: <LoadingRulesNotification />
  });

  const loadedRuleForms$ = getServiceExtractionConfig(ruleType).map(createRuleForms);

  loadedRuleForms$.once(ruleForms => {
    ruleFormsStore.mutateTo(ruleForms);
    clearNotification();
  });

  loadedRuleForms$.errors().once(error => {
    showNofitication({
      children: <LoadingRulesFailedNotification error={error} />
    });

    logger.error(`Failed to load rules: ${error.message}`, error);
  });
}

function createRuleForms(rules) {
  const ruleForms = rules.reduce((acc, cur) => {
    const ruleForm = ruleToMapForm(cur);
    return acc.push(ruleForm);
  }, createListForm({}));

  return ruleForms;
}

function ruleToMapForm(rule, fromJson = false) {
  const initialForm = createMapForm({ validator: atLeastOneMatchSpecificationRule });

  const matchSpecificationForm = rule.matchSpecification
    ? Object.keys(rule.matchSpecification).reduce((acc, cur) => {
        const field = createField({
          value: rule.matchSpecification[cur],
          validator: matchSpecificationMustCompileRule
        });
        return acc.put(cur, field, matchSpecificationMustCompileRule);
      }, initialForm)
    : initialForm;

  return createMapForm({})
    .put('id', createField({ value: fromJson ? rule.id : generateUniqueShortId() }))
    .put('name', createField({ value: rule.name || '' }))
    .put('enabled', createField({ value: Boolean(rule.enabled) }))
    .put('comment', createField({ value: rule.comment || '' }))
    .put('matchSpecification', matchSpecificationForm)
    .put('label', createField({ value: (rule.extractSpecification && rule.extractSpecification.label) || '' }));
}

export function saveRules(ruleForms) {
  showNofitication({
    children: <SavingRulesNotification />
  });

  const rules = createRulesFromRuleForms(ruleForms);
  const saveResult$ = savePartialServiceExtractionConfig(ruleType, rules);

  saveResult$.once(() => {
    showNofitication({
      children: <SavingRulesSuccessfulNotification />,
      duration: 3000
    });
  });

  saveResult$.errors().once(error => {
    showNofitication({
      children: <SavingRulesFailedNotification error={error} />,
      duration: 3000
    });
    logger.error(`Failed to save rules: ${error.message}`, error);
  });
}

export function createRulesFromRuleForms(ruleForms) {
  return ruleForms.map((ruleForm, i) => {
    const matchSpecificationForm = ruleForm.get('matchSpecification').toJS();

    const matchSpecification = Object.keys(matchSpecificationForm).reduce((acc, cur) => {
      acc[cur] = matchSpecificationForm[cur].value;
      return acc;
    }, {});
    return {
      id: ruleForm.get('id').value,
      name: ruleForm.get('name').value,
      enabled: ruleForm.get('enabled').value,
      comment: ruleForm.get('comment').value,
      order: i,
      type: ruleType,
      parent: null,
      matchSpecification,
      extractSpecification: {
        label: ruleForm.get('label').value
      }
    };
  });
}

function atLeastOneMatchSpecificationRule(mapForm) {
  if (Object.keys(mapForm).length === 0) {
    return atLeastOneMatchResult;
  }
  return null;
}

const atLeastOneMatchResult = [
  {
    severity: 'error',
    message: 'At least one match expression is required.'
  }
];

function matchSpecificationMustCompileRule(regex) {
  try {
    /* eslint-disable no-new */
    new RegExp(regex);
    /* eslint-enable no-new */
    return null;
  } catch (e) {
    return [
      {
        severity: 'error',
        message: e.message
      }
    ];
  }
}

export function setRuleFormsFromJsonUserInput(rules) {
  if (!(rules instanceof Array)) {
    return;
  }

  const ruleForms = rules.reduce((acc, cur) => {
    const ruleForm = ruleToMapForm(cur, true);
    return acc.push(ruleForm);
  }, createListForm({}));

  ruleFormsStore.mutateTo(ruleForms);
}
