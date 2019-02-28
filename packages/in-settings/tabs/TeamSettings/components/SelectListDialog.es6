import { withState } from 'recompose';
import React from 'react';

import ValidationBlock from 'in-components/form/ValidationBlock';
import { close } from 'in-components/DialogPresenter/store';
import FormGroup from 'in-components/form/FormGroup';
import Dialog from 'in-new-components/Dialog';
import Button from 'in-new-components/Button';

import locals from './SelectListDialog.mless';

export default withState(
  'selectedItems',
  'setSelectedItems',
  ({ selectedItems: initiallySelectedItems }) => initiallySelectedItems
)(SelectChannelsDialog);

function SelectChannelsDialog({
  title = 'Select',
  listComponent,
  onSubmit,
  createSubmitLabel = () => 'Confirm',
  requiresAtLeastOneMessage,
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
        <FormGroup style={{ height: 'calc(90vh - 180px)', overflowY: 'auto' }}>
          <ListComponent
            setTitle={false}
            tableClassName={locals.tableHeight}
            tableStyle={{ height: 'calc(100vh - 450px)' }}
            pageSize={7}
            hasRowNavigation={false}
            onRowClick={entity => toggle(selectedItems, setSelectedItems, entity)}
            tableActions={{
              selectCheckbox: {
                get(entity) {
                  return selectedItems.indexOf(entity.id) >= 0;
                },
                toggle(entity) {
                  toggle(selectedItems, setSelectedItems, entity);
                }
              }
            }}
            rightHeader={
              /* Can't use null or undefined here as this would make the default right header to be rendered, but we
              want to explicitly disable that default header. Reason: The default right header (create new entitiy would
              navigate from the form in which's context this dialog is shown, thus the user would lose all their unsaved
              edits on the current form.
              */ ''
            }
          />
          {requiresAtLeastOneMessage &&
            numberOfItems === 0 && <ValidationBlock>{requiresAtLeastOneMessage}</ValidationBlock>}
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

function toggle(selectedItems, setSelectedItems, entity) {
  if (selectedItems.indexOf(entity.id) >= 0) {
    setSelectedItems(selectedItems.filter(id => id !== entity.id));
  } else {
    setSelectedItems(selectedItems.concat(entity.id));
  }
}
