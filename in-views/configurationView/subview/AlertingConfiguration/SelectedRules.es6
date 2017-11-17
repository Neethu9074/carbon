import React from 'react';

import TwoColumnMultiSelect from 'in-components/TwoColumnMultiSelect/TwoColumnMultiSelect';
import LoadingIndicator from 'in-components/LoadingIndicator';
import { getHealthRules } from 'in-services/api/healthRules';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  {
    healthRules: getHealthRules()
  },
  function SelectedRule({ form, onChange, healthRules }) {
    if (!healthRules) {
      return <LoadingIndicator type="dark" />;
    }

    const selectedRulesAsMap = {};
    let selectedItems = form.get('ruleIds').value.toArray();

    selectedItems.forEach(rule => (selectedRulesAsMap[rule] = true));
    const selectableItems = healthRules.filter(rule => !selectedRulesAsMap[rule.get('id')]);
    selectedItems = healthRules.filter(rule => selectedRulesAsMap[rule.get('id')]);

    return (
      <TwoColumnMultiSelect
        selectableItems={selectableItems}
        selectedItems={selectedItems}
        onSelectableClick={rule => selectRule(rule, form, onChange)}
        onSelectedClick={rule => deSelectRule(rule, form, onChange)}
        Item={Item}
      />
    );
  }
);

function Item({ item }) {
  return <div>{item.get('description')}</div>;
}

function selectRule(rule, form, onChange) {
  let ruleIds = form.get('ruleIds').value;
  ruleIds = ruleIds.push(rule.get('id'));
  onChange('ruleIds', ruleIds);
}

function deSelectRule(rule, form, onChange) {
  let ruleIndex = -1;
  let ruleIds = form.get('ruleIds').value;

  for (let i = 0, length = ruleIds.size; i < length; i++) {
    if (ruleIds.get(i) === rule.get('id')) {
      ruleIndex = i;
      break;
    }
  }

  if (ruleIndex < 0) {
    return;
  }

  ruleIds = ruleIds.delete(ruleIndex);
  onChange('ruleIds', ruleIds);
}
