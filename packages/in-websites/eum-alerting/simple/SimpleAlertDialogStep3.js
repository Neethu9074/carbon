import PropTypes from 'prop-types';
import React from 'react';

import AlertChannels, {
  noRightHeader
} from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/AlertChannels/AlertChannels';
import createMemoizedObservableForReferencedEntities from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Alerts/components/memoizeReferencedEntitiesObservable';
import { limitForConnectedAlertChannels } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Alerts/Alert';
import SelectListDialogButton from 'in-settings/tabs/TeamSettings/components/SelectListDialogButton';
import { fieldNames } from 'in-websites/eum-alerting/form/alertDialogFormDefinition';
import { getAlertChannelsByIdsMutable } from 'in-api/alertChannels';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { alwaysEmptyArray } from 'in-services/fixedStreams';

import locals from './SimpleAlertDialogStep.mless';

export default function SimpleAlertDialogStep3({ form, onChange }) {
  return (
    <>
      <h1 className={locals.headline}>Who should get the alerts?</h1>
      <div className={locals.alertChannelsContainer}>
        {form &&
          form.get(fieldNames.alertChannelIds).map(field => (
            <>
              <AlertChannels
                setTitle={false}
                loadEntities={() => getSelectedAlertChannels(field.value)}
                hasRowNavigation={false}
                noDataMessage="In order to receive alerts, you need to select at least 1 Alert Channel."
                tableActions={alertChannelSelectionTableActions(form, onChange)}
                rightHeader={
                  <SelectListDialogButton
                    form={form}
                    onSubmit={selectedIds => onChange(form, fieldNames.alertChannelIds, selectedIds)}
                    title="Add Alert Channels"
                    label={'Add Alert Channels'}
                    listComponent={AlertChannels}
                    listComponentRightHeader={noRightHeader}
                    hiddenIds={field.value}
                    limit={limitForConnectedAlertChannels}
                    createSubmitLabel={numberOfItems =>
                      numberOfItems > 0 ? `Add ${numberOfItems} Channel${numberOfItems > 1 ? 's' : ''}` : 'Add'
                    }
                    requiresAtLeastOneMessage="Please select at least one alert channel."
                  />
                }
              />
              <TouchedMessages field={field} />
            </>
          ))}
      </div>
    </>
  );
}

SimpleAlertDialogStep3.propTypes = {
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};

const getSelectedAlertChannels = createMemoizedObservableForReferencedEntities(function(selectedChannels) {
  if (selectedChannels.length === 0) {
    return alwaysEmptyArray;
  }
  // null is treated as a pending result when converting the HTTP response into a result
  return getAlertChannelsByIdsMutable(selectedChannels).startWith(null);
});

function alertChannelSelectionTableActions(form, onChange) {
  return {
    deselect: {
      deselect: deselectedEntity => {
        if (deselectedEntity) {
          const value = form
            .get(fieldNames.alertChannelIds)
            .value.filter(referencedId => referencedId !== deselectedEntity.id);

          onChange(form, fieldNames.alertChannelIds, value);
        }
      }
    }
  };
}
