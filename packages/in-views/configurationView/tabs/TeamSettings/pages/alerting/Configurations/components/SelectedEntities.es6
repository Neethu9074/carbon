import React from 'react';

import TwoColumnMultiSelect from 'in-components/TwoColumnMultiSelect/TwoColumnMultiSelect';
import FormGroup from 'in-views/configurationView/components/FormGroup';
import TouchedMessages from 'in-components/form/TouchedMessages';
import LoadingIndicator from 'in-components/LoadingIndicator';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    items: props.getItems()
  }),
  function SelectedEntities({ form, onChange, items, formFieldName, fieldName }) {
    if (!items || items) {
      return null;
    }
    if (!items) {
      return <LoadingIndicator type="dark" />;
    }

    const selectedItemsAsMap = {};
    let selectedItems = form.get(formFieldName).value.toArray();

    selectedItems.forEach(item => (selectedItemsAsMap[item] = true));
    const selectableItems = items.filter(item => !selectedItemsAsMap[item.get('id')]);
    selectedItems = items.filter(item => selectedItemsAsMap[item.get('id')]);

    return form.get(formFieldName).map(field => (
      <FormGroup>
        <TouchedMessages field={field} />
        <TwoColumnMultiSelect
          selectableItems={selectableItems}
          selectedItems={selectedItems}
          onSelectableClick={item => select(item, form, onChange, formFieldName)}
          onSelectedClick={item => remove(item, form, onChange, formFieldName)}
          Item={Item}
          fieldName={fieldName}
        />
      </FormGroup>
    ));
  }
);

function Item({ item, fieldName }) {
  return item.get(fieldName);
}

function select(item, form, onChange, formFieldName) {
  let ids = form.get(formFieldName).value;
  ids = ids.push(item.get('id'));
  onChange(formFieldName, ids);
}

function remove(item, form, onChange, formFieldName) {
  let ids = form.get(formFieldName).value;
  ids = ids.delete(ids.indexOf(item.get('id')));
  onChange(formFieldName, ids);
}
