import { withState } from 'recompose';
import React from 'react';

import ValidationBlock from 'in-components/form/ValidationBlock';
import { close } from 'in-components/DialogPresenter/store';
import FormGroup from 'in-components/form/FormGroup';
import Dialog from 'in-new-components/Dialog';
import Button from 'in-new-components/Button';

import locals from './SelectListDialog.mless';

export default withState('selectedItems', 'setSelectedItems', [])(SelectChannelsDialog);

function SelectChannelsDialog({
  title = 'Select',
  listComponent,
  listComponentRightHeader,
  onSubmit,
  createSubmitLabel = () => 'Add',
  requiresAtLeastOneMessage = 'Please select at least one item.',
  hiddenIds,
  selectedItems,
  setSelectedItems
}) {
  const ListComponent = listComponent;
  const numberOfItems = selectedItems.length;
  return (
    <Dialog title={title} onClose={close} className={locals.dialog}>
      <form
        onSubmit={() => {
          onSubmit(selectedItems);
          close();
        }}
        autoComplete="off"
      >
        <FormGroup
          style={{
            // calc expressions are corrupted by our CSS processing :-/
            height: 'calc(90vh - 180px)'
          }}
        >
          <ListComponent
            setTitle={false}
            scrollWrapperClassName={locals.tableScrollWrapper}
            scrollWrapperStyle={{
              // calc expressions are corrupted by our CSS processing :-/
              height: 'calc(100vh - 420px)'
            }}
            pageSize={7}
            hiddenIds={hiddenIds}
            hasRowNavigation={false}
            noDataMessage="No items available."
            onRowClick={entity => toggle(selectedItems, setSelectedItems, entity)}
            tableActions={{
              selectCheckbox: {
                get(entity) {
                  return get(selectedItems, entity);
                },
                setAll(entities, selected) {
                  setAll(selectedItems, setSelectedItems, entities, selected);
                },
                toggle(entity) {
                  toggle(selectedItems, setSelectedItems, entity);
                }
              }
            }}
            rightHeader={listComponentRightHeader}
            inSelectListDialog
          />
          {numberOfItems === 0 && <ValidationBlock>{requiresAtLeastOneMessage}</ValidationBlock>}
        </FormGroup>
        <div className={locals.actions}>
          <Button type="submit" kind={'secondary'} onClick={close} classNam>
            Cancel
          </Button>
          <Button type="submit" kind={'primary'} disabled={requiresAtLeastOneMessage && numberOfItems === 0}>
            {createSubmitLabel(numberOfItems)}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

function get(selectedItems, entity) {
  return selectedItems.indexOf(entity.id) >= 0;
}

function toggle(selectedItems, setSelectedItems, entity) {
  if (get(selectedItems, entity)) {
    removeFromSelection(setSelectedItems, selectedItems, entity);
  } else {
    addToSelection(setSelectedItems, selectedItems, entity);
  }
}

function setAll(selectedItems, setSelectedItems, entities, selected) {
  let entity;
  for (let i = 0; i < entities.length; i++) {
    entity = entities[i];
    if (get(selectedItems, entity) && !selected) {
      selectedItems = selectedItems.filter(id => id !== entity.id);
    } else if (!get(selectedItems, entity) && selected) {
      selectedItems = selectedItems.concat(entity.id);
    }
  }
  setSelectedItems(selectedItems);
}

function addToSelection(setSelectedItems, selectedItems, entity) {
  setSelectedItems(selectedItems.concat(entity.id));
}

function removeFromSelection(setSelectedItems, selectedItems, entity) {
  setSelectedItems(selectedItems.filter(id => id !== entity.id));
}
