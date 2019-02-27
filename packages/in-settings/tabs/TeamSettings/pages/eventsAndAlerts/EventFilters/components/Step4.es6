import React, { Fragment } from 'react';
import { fromJS, List } from 'immutable';

import SelectListDialogButton from 'in-settings/tabs/TeamSettings/components/SelectListDialogButton';
import AlertChannels from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/AlertChannels/AlertChannels';
import SectionHeading from 'in-settings/components/SectionHeading';
import { getIntegrationsByIdsMutable } from 'in-api/integrations';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { alwaysEmptyArray } from 'in-services/fixedStreams';

export default function Step4({ form, setForm }) {
  const selectedChannels = form.get('selectedAlertChannels') ? form.get('selectedAlertChannels').value : List();

  return (
    <Fragment>
      <div style={{ marginTop: '2rem' }} />
      <SectionHeading>4. Alerting</SectionHeading>
      <AlertChannels
        setTitle={false}
        loadEntities={() => getSelectedAlertChannels(selectedChannels)}
        hasRowNavigation={false}
        noDataMessage="No Alert Channels Selected"
        tableActions={alertChannelSelectionTableActions(form, setForm)}
        rightHeader={
          <SelectListDialogButton
            form={form}
            onSubmit={selectedIds => submitChannelSelection(form, setForm, selectedIds)}
            title="Select Alert Channels"
            label={'Select Alert Channels'}
            listComponent={AlertChannels}
            selectedItems={form.get('selectedAlertChannels').value.toJS()}
            createSubmitLabel={numberOfItems => (numberOfItems > 0 ? `Confirm ${numberOfItems} Channels` : 'Confirm')}
          />
        }
      />
      <TouchedMessages field={form.get('selectedAlertChannels')} />
    </Fragment>
  );
}

function getSelectedAlertChannels(selectedChannels) {
  if (selectedChannels.isEmpty()) {
    return alwaysEmptyArray;
  }
  return getIntegrationsByIdsMutable(selectedChannels.toJS());
}

function alertChannelSelectionTableActions(form, setForm) {
  return {
    deselect: {
      deselect: deselectedEntity => {
        if (deselectedEntity) {
          form = form.updateIn(['selectedAlertChannels'], field => {
            return field.setValue(field.value.filterNot(referencedId => referencedId === deselectedEntity.id));
          });
          setForm(form);
        }
      }
    }
  };
}

function submitChannelSelection(form, setForm, selectedIds) {
  setForm(
    form.updateIn(['selectedAlertChannels'], field => {
      return field.setValue(fromJS(selectedIds));
    })
  );
}
