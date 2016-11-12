import Immutable from 'immutable';

import {addMessage, removeMessage} from 'in-components/MessageFlyout/stores/messages';
import {generateUniqueShortId} from 'in-services/util/id';
import {emptyList} from 'in-services/fixedImmutables';
import {createStore} from 'in-stores/store';
import config from 'in-services/config';
import http from 'in-services/http';

const ruleType = 'webapp';
const ruleMessageId = 'config-view-webapp-rules';

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
    type: ruleType,
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


export function moveRuleDown(ruleId) {
  manipulateRulePosition(ruleId, +1);
}


export function moveRuleUp(ruleId) {
  manipulateRulePosition(ruleId, -1);
}


export function removeAllRules() {
  rulesStore.mutateTo(emptyList);
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

  const request$ = http({
    method: 'GET',
    url: `/ump/${config.tenant}/${config.tenantUnit}/serviceExtractionConfig`
  });

  request$
    .once(response => {
      const httpRules = response.body.rules
        .filter(rule => rule.type === ruleType);
      rulesStore.mutateTo(Immutable.fromJS(httpRules));
      removeMessage(ruleMessageId);
    });

  request$
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


export function save() {
  addMessage({
    type: 'info',
    icon: 'ok',
    content: 'Saving rules…'
  }, ruleMessageId);

  rules$.once(immutableRules => {
    const data = {
      lastModificationTimestamp: Date.now(),
      rules: []
    };

    immutableRules.forEach((immutableRule, i) => {
      const rule = immutableRule.toJS();
      rule.order = i;
      data.rules.push(rule);
    });

    const request$ = http({
      method: 'POST',
      url: `/ump/${config.tenant}/${config.tenantUnit}/serviceExtractionConfig`,
      data
    });

    request$
      .once(response => {
        addMessage({
          type: 'info',
          icon: 'ok',
          content: 'Rules successfully saved.'
        }, ruleMessageId);

        console.log('Successfully saved', {response});
      });

    request$
      .errors()
      .once(error => {
        addMessage({
          type: 'danger',
          icon: 'ok',
          content: 'Failed to save rules.'
        }, ruleMessageId);

        console.error({error});
      });
  });
}
