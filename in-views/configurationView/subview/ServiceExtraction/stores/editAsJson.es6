import React from 'react';

import EditAsJsonDialog from 'in-views/configurationView/subview/ServiceExtraction/components/EditAsJsonDialog';
import { setActiveDialog, close } from 'in-components/DialogPresenter/store';

export function openEditor(serviceRules, save) {
  const rulesAsJson = [];
  serviceRules.forEach(rule => {
    rulesAsJson.push(removeValuesWhichAreMeaninglessToUsers(rule.toJS()));
  });

  function saveAndClose(rules) {
    close();
    save(rules);
  }

  setActiveDialog(
    <EditAsJsonDialog initialValue={JSON.stringify(rulesAsJson, 0, 2)} onSaveAndClose={saveAndClose} onClose={close} />
  );
}

function removeValuesWhichAreMeaninglessToUsers(rule) {
  delete rule.id;
  delete rule.order;
  delete rule.type;
  for (let i = 0, length = rule.endpointRules.length; i < length; i++) {
    const endpoint = rule.endpointRules[i];
    delete endpoint.id;
  }
  return rule;
}
