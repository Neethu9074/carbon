import React from 'react';

import EditAsJsonDialog
  from 'in-views/configurationView/subview/HttpServiceExtractionConfiguration/components/EditAsJsonDialog';
import {
  createRulesFromRuleForms,
  ruleForms$,
  setRuleFormsFromJsonUserInput
} from 'in-views/configurationView/subview/HttpServiceExtractionConfiguration/stores/ruleForms';
import {setActiveDialog, close} from 'in-components/DialogPresenter/store';

export function openEditor() {
  // strip ID, type and order

  ruleForms$
    .once(ruleForms => {
      const rules = removeValuesWhichAreMeaninglessToUsers(createRulesFromRuleForms(ruleForms));
      const initialValue = JSON.stringify(rules, 0, 2);
      setActiveDialog(
        <EditAsJsonDialog initialValue={initialValue}
                          onSaveAndClose={save}
                          onClose={close}/>
      );
    });
}


function removeValuesWhichAreMeaninglessToUsers(rules) {
  rules.forEach(rule => {
    delete rule.id;
    delete rule.order;
    delete rule.type;
    delete rule.parent;
  });
  return rules;
}


function save(value) {
  close();
  setRuleFormsFromJsonUserInput(value);
}
