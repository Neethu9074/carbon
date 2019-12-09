import PropTypes from 'prop-types';
import React from 'react';

import AlertChannels, {
  noRightHeader
} from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/AlertChannels/AlertChannels';
import createMemoizedObservableForReferencedEntities from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Alerts/components/memoizeReferencedEntitiesObservable';
import { limitForConnectedAlertChannels } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Alerts/Alert';
import SelectListDialogContent from 'in-settings/tabs/TeamSettings/components/SelectListDialogContent';
import { fieldNames } from 'in-websites/eum-alerting/form/alertDialogFormDefinition';
import { getAlertChannelsByIdsMutable } from 'in-api/alertChannels';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { alwaysEmptyArray } from 'in-services/fixedStreams';
import Button from 'in-new-components/Button/Button';

import locals from './SelectAlertChannel.mless';

export default function SelectAlertChannel({ form, onChange, setAlertChannelsVisible }) {
  return (
    <>
      <AlertChannels
        setTitle={false}
        loadEntities={() => getSelectedAlertChannels(form.get(fieldNames.alertChannelIds).value)}
        hasRowNavigation={false}
        noDataMessage="In order to receive alerts, you need to select at least 1 Alert Channel."
        tableActions={alertChannelSelectionTableActions(form, onChange)}
        rightHeader={
          <Button
            kind="action"
            onClick={() =>
              setAlertChannelsVisible({
                slideInConfig: {
                  component: (
                    <SelectListDialogContent
                      listComponent={AlertChannels}
                      listComponentRightHeader={noRightHeader}
                      hiddenIds={form.get(fieldNames.alertChannelIds).value}
                      limit={limitForConnectedAlertChannels}
                      onSubmit={selectedIds => {
                        onChange(form, fieldNames.alertChannelIds, selectedIds);
                        setAlertChannelsVisible({ isVisible: false });
                      }}
                      createSubmitLabel={numberOfItems =>
                        numberOfItems > 0 ? `Add ${numberOfItems} Channel${numberOfItems > 1 ? 's' : ''}` : 'Add'
                      }
                      requiresAtLeastOneMessage="Please select at least one alert channel."
                      pageSize={5}
                      listFormGroupClassOverwrites={locals.alertChannelsList}
                      tableScrollWrapperClassOverwrites={locals.alertChannelsList}
                    />
                  ),
                  title: 'Select alert channels'
                },
                isVisible: true
              })
            }
            icon="lib_openclose_add_circle_outline"
          >
            Select Alert Channels
          </Button>
        }
      />
      <TouchedMessages field={form.get(fieldNames.alertChannelIds)} />
    </>
  );
}

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

SelectAlertChannel.propTypes = {
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};
