import React from 'react';

import TwoColumnMultiSelect from 'in-components/TwoColumnMultiSelect/TwoColumnMultiSelect';
import ValidationBlock from 'in-components/form/ValidationBlock';
import LoadingIndicator from 'in-components/LoadingIndicator';
import FormGroup from 'in-components/form/FormGroup';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    items: props.getItems()
  }),
  function SelectedEntities({ form, onChange, items, formFieldName, fieldName, addNewItem }) {
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
        {field.messages.map((message, i) => (
          <ValidationBlock hasError key={i}>
            {message.message}
          </ValidationBlock>
        ))}
        <TwoColumnMultiSelect
          selectableItems={selectableItems}
          selectedItems={selectedItems}
          onSelectableClick={item => select(item, form, onChange, formFieldName)}
          onSelectedClick={item => remove(item, form, onChange, formFieldName)}
          Item={Item}
          fieldName={fieldName}
          addNewItem={addNewItem}
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
