import { compose, withState } from 'recompose';
import React from 'react';

import { limitForConnectedEntities } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Alerts/Alert';
import ValidationBlock from 'in-components/form/ValidationBlock';
import { close } from 'in-components/DialogPresenter/store';
import FormGroup from 'in-components/form/FormGroup';
import Dialog from 'in-new-components/Dialog';
import Button from 'in-new-components/Button';

import locals from './SelectListDialog.mless';

const defaultRequiresAtLeastOneMessage = 'Please select at least one item.';

export default compose(
  withState('selectedItems', 'setSelectedItems', []),
  withState(
    'errorMessage',
    'setErrorMessage',
    ({ requiresAtLeastOneMessage }) =>
      requiresAtLeastOneMessage ? requiresAtLeastOneMessage : defaultRequiresAtLeastOneMessage
  )
)(SelectChannelsDialog);

function SelectChannelsDialog({
  title = 'Select',
  listComponent,
  listComponentRightHeader,
  onSubmit,
  createSubmitLabel = () => 'Add',
  requiresAtLeastOneMessage = defaultRequiresAtLeastOneMessage,
  hiddenIds = [],
  selectedItems,
  setSelectedItems,
  errorMessage,
  setErrorMessage,
  limit = limitForConnectedEntities
}) {
  limit = limit - hiddenIds.length; // take the items that are already selected into account
  const ListComponent = listComponent;
  const numberOfItems = selectedItems.length;
  if (!errorMessage && numberOfItems === 0) {
    errorMessage = requiresAtLeastOneMessage;
  }
  return (
    <Dialog title={title} onClose={close} className={locals.dialog}>
      <form
        onSubmit={() => {
          onSubmit(selectedItems);
          close();
        }}
        autoComplete="off"
      >
        <FormGroup>
          <div className={locals.listFormGroup}>
            <ListComponent
              setTitle={false}
              scrollWrapperClassName={locals.tableScrollWrapper}
              pageSize={7}
              hiddenIds={hiddenIds}
              hasRowNavigation={false}
              noDataMessage="No items available."
              onRowClick={entity => toggle(selectedItems, setSelectedItems, entity, limit, setErrorMessage)}
              tableActions={{
                selectCheckbox: {
                  get(entity) {
                    return get(selectedItems, entity);
                  },
                  setAll(entities, selected, page, pageSize) {
                    setAll(selectedItems, setSelectedItems, entities, selected, limit, setErrorMessage, page, pageSize);
                  },
                  toggle(entity) {
                    toggle(selectedItems, setSelectedItems, entity, limit, setErrorMessage);
                  }
                }
              }}
              rightHeader={listComponentRightHeader}
              inSelectListDialog
            />
          </div>
          {errorMessage && <ValidationBlock className={locals.errorMessage}>{errorMessage}</ValidationBlock>}
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

function toggle(selectedItems, setSelectedItems, entity, limit, setErrorMessage) {
  if (get(selectedItems, entity)) {
    removeFromSelection(setSelectedItems, selectedItems, entity, setErrorMessage);
  } else {
    addToSelection(setSelectedItems, selectedItems, entity, limit, setErrorMessage);
  }
}

function addToSelection(setSelectedItems, selectedItems, entity, limit, setErrorMessage) {
  if (selectedItems.length >= limit) {
    if (limit === 0) {
      setErrorMessage('You cannot add more items.');
    } else if (limit === 1) {
      setErrorMessage('You can only add one item.');
    } else {
      setErrorMessage(`You can add at most ${limit} items.`);
    }
    return;
  }
  setSelectedItems(selectedItems.concat(entity.id));
  setErrorMessage(null);
}

function removeFromSelection(setSelectedItems, selectedItems, entity, setErrorMessage) {
  setSelectedItems(selectedItems.filter(id => id !== entity.id));
  setErrorMessage(null);
}

function setAll(selectedItems, setSelectedItems, entities, selected, limit, setErrorMessage, page, pageSize) {
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(page * pageSize, entities.length);
  let entity;

  if (selected) {
    let entitiesToBeAdded = 0;
    for (let i = startIndex; i < endIndex; i++) {
      entity = entities[i];
      if (!get(selectedItems, entity)) {
        entitiesToBeAdded++;
      }
    }
    if (selectedItems.length + entitiesToBeAdded > limit) {
      if (limit === 0) {
        setErrorMessage('You cannot add more items.');
      } else if (limit === 1) {
        setErrorMessage('You can only add one item.');
      } else {
        setErrorMessage(
          `You can add at most ${limit} items more items. Please narrow down your selection by using the filters.`
        );
      }
      return;
    }
  }
  setErrorMessage(null);

  for (let i = startIndex; i < endIndex; i++) {
    entity = entities[i];
    if (get(selectedItems, entity) && !selected) {
      selectedItems = selectedItems.filter(id => id !== entity.id);
    } else if (!get(selectedItems, entity) && selected) {
      selectedItems = selectedItems.concat(entity.id);
    }
  }
  setSelectedItems(selectedItems);
}
