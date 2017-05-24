import React from 'react';

import EditAsJsonDialog from 'in-views/configurationView/subview/ServiceExtraction/components/EditAsJsonDialog';
import { createEndpointRule, createServiceRule } from 'in-services/api/serviceExtraction';
import { setActiveDialog, close } from 'in-components/DialogPresenter/store';

export function openEditor(serviceRules, save, type) {
  function saveAndClose(rules) {
    close();
    save(enrichValuesWhichWhereMeaninglessToUsers(rules, type));
  }

  setActiveDialog(
    <EditAsJsonDialog
      initialValue={JSON.stringify(removeValuesWhichAreMeaninglessToUsers(serviceRules), 0, 2)}
      onSaveAndClose={saveAndClose}
      onClose={close}
    />
  );
}

function removeValuesWhichAreMeaninglessToUsers(rules) {
  const rawRules = [];
  rules.forEach(rule => {
    rule = rule.toJS();
    delete rule.id;
    delete rule.order;
    delete rule.type;
    for (let i = 0, length = rule.endpointRules.length; i < length; i++) {
      const endpoint = rule.endpointRules[i];
      delete endpoint.id;
    }
    rawRules.push(rule);
  });
  return rawRules;
}

function enrichValuesWhichWhereMeaninglessToUsers(rules, type) {
  const enrichedRules = [];
  for (let i = 0, length = rules.length; i < length; i++) {
    const rule = rules[i];
    enrichedRules.push(
      createServiceRule({
        name: rule.name,
        enabled: rule.enabled,
        comment: rule.comment,
        matchSpecification: rule.matchSpecification,
        label: rule.extractSpecification ? rule.extractSpecification.label : null,
        endpointRules: enrichEndpointRules(rule.endpointRules),
        type,
        order: i
      })
    );
  }
  return enrichedRules;
}

function enrichEndpointRules(endpoints) {
  if (!endpoints) {
    return [];
  }

  const enrichedEndpoints = [];
  for (let i = 0, length = endpoints.length; i < length; i++) {
    const endpoint = endpoints[i];
    enrichedEndpoints.push(
      createEndpointRule({
        name: endpoint.name,
        enabled: endpoint.enabled,
        comment: endpoint.comment,
        matchSpecification: endpoint.matchSpecification,
        label: endpoint.extractSpecification ? endpoint.extractSpecification.label : null
      })
    );
  }
  return enrichedEndpoints;
}
