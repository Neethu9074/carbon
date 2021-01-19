/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { Fragment } from 'react';
import { fromJS } from 'immutable';

import AlertChannels, {
  noRightHeader
} from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/AlertChannels/AlertChannels';
import createMemoizedObservableForReferencedEntities from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Alerts/components/memoizeReferencedEntitiesObservable';
import { limitForConnectedAlertChannels } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Alerts/Alert';
import SelectListDialogButton from 'in-settings/tabs/TeamSettings/components/SelectListDialogButton';
import SectionHeading from 'in-settings/components/SectionHeading';
import { getAlertChannelsByIdsMutable } from 'in-api/alertChannels';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { alwaysEmptyArray } from 'in-services/fixedStreams';

export default function Step4({ form, setForm }) {
  const selectedChannels = form.get('selectedAlertChannels') ? form.get('selectedAlertChannels').value.toJS() : [];

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
            title="Add Alert Channels"
            label={'Add Alert Channels'}
            listComponent={AlertChannels}
            listComponentRightHeader={noRightHeader}
            hiddenIds={form.get('selectedAlertChannels').value.toJS()}
            limit={limitForConnectedAlertChannels}
            createSubmitLabel={numberOfItems =>
              numberOfItems > 0 ? `Add ${numberOfItems} Channel${numberOfItems > 1 ? 's' : ''}` : 'Add'
            }
            requiresAtLeastOneMessage="Please select at least one alert channel."
          />
        }
      />
      <TouchedMessages field={form.get('selectedAlertChannels')} />
    </Fragment>
  );
}

const getSelectedAlertChannels = createMemoizedObservableForReferencedEntities(function(selectedChannels) {
  if (selectedChannels.length === 0) {
    return alwaysEmptyArray;
  }
  // null is treated as a pending result when converting the HTTP response into a result
  return getAlertChannelsByIdsMutable(selectedChannels).startWith(null);
});

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
      return field.setValue(field.value.concat(fromJS(selectedIds)));
    })
  );
}
