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
  // TODO There are sometimes references to ghost entities (IDs which no longer refer to an existing entity). Those are
  // counted here but not displayed in the list, which is confusing. This needs to be cleaned up by the back end if we
  // want to avoid loading _all entities_.
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
        <FormGroup>
          <ListComponent
            setTitle={false}
            pageSize={7}
            hasRowNavigation={false}
            tableActions={{
              selectCheckbox: {
                get(entity) {
                  return selectedItems.indexOf(entity.id) >= 0;
                },
                toggle(entity) {
                  if (selectedItems.indexOf(entity.id) >= 0) {
                    setSelectedItems(selectedItems.filter(id => id !== entity.id));
                  } else {
                    setSelectedItems(selectedItems.concat(entity.id));
                  }
                }
              }
            }}
            rightHeader={undefined}
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
