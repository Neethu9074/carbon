import Immutable from 'immutable';

import {generateUniqueShortId} from 'in-services/util/id';
import {emptyList} from 'in-services/fixedImmutables';
import {createStore} from 'in-stores/store';

const rulesStore = createStore({
  name: 'in-views/configurationView/subview/HttpServiceExtractionConfiguration/stores/rules',
  initialValue: emptyList
});
export const rules$ = rulesStore.observable
  .distinct();


export function addNewRule(id) {
  const newRule = Immutable.Map({
    id: id || generateUniqueShortId(),
    name: 'New Service Rule',
    enabled: false,
    comment: '',
    order: 0,
    type: 'http',
    parent: null,
    matchSpecification: Immutable.Map(),
    extractSpecification: Immutable.Map({
      label: 'Unnamed service'
    })
  });
  upsertRule(newRule);
  return newRule;
}


export function upsertRule(rule) {
  const id = rule.get('id');

  rulesStore.applyStateMutation(rules => {
    const index = rules.findIndex(eachRule => eachRule.get('id') === id);
    if (index === -1) {
      return rules.push(rule);
    }

    return rules.set(index, rule);
  });
}


export function removeRule(ruleId) {
  rulesStore.applyStateMutation(rules => {
    const index = rules.findIndex(eachRule => eachRule.get('id') === ruleId);
    if (index === -1) {
      return rules;
    }

    return rules.delete(index);
  });
}


export function moveRuleUp(ruleId) {
  manipulateRulePosition(ruleId, +1);
}

export function moveRuleDown(ruleId) {
  manipulateRulePosition(ruleId, -1);
}

function manipulateRulePosition(ruleId, indexChange) {
  rulesStore.applyStateMutation(rules => {
    const index = rules.findIndex(eachRule => eachRule.get('id') === ruleId);
    if (index === -1) {
      return rules;
    }

    const rule = rules.get(index);
    const newIndex = Math.min(rules.size - 1, Math.max(0, index + indexChange));
    return rules.remove(index).insert(newIndex, rule);
  });
}
