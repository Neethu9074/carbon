import PropTypes from 'prop-types';
import React from 'react';

import createMemoizedObservableForReferencedEntities from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Alerts/components/memoizeReferencedEntitiesObservable';
import AlertChannels, {
  noRightHeader
} from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/AlertChannels/AlertChannels';
import { limitForConnectedAlertChannels } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Alerts/Alert';
import SelectListDialogContentComponent from 'in-settings/tabs/TeamSettings/components/SelectListDialogContent';
import { fieldNames } from 'in-websites/eum-alerting/form/alertDialogFormDefinition';
import { getAlertChannelsByIdsMutable } from 'in-api/alertChannels';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { alwaysEmptyArray } from 'in-services/fixedStreams';

import locals from './SelectAlertChannel.mless';

export default function SelectAlertChannelPresenter(props) {
  const { form, onChange } = props;

  return (
    <>
      <AlertChannels
        setTitle={false}
        loadEntities={() => getSelectedAlertChannels(form.get(fieldNames.alertChannelIds).value)}
        hasRowNavigation={false}
        noDataMessage="In order to receive alerts, you need to select at least 1 Alert Channel."
        tableActions={alertChannelSelectionTableActions(form, onChange)}
        {...props}
      />
      <TouchedMessages field={form.get(fieldNames.alertChannelIds)} />
    </>
  );
}

export function SelectListDialogContent({ form, onSubmit }) {
  return (
    <SelectListDialogContentComponent
      listComponent={AlertChannels}
      listComponentRightHeader={noRightHeader}
      hiddenIds={form.get(fieldNames.alertChannelIds).value}
      limit={limitForConnectedAlertChannels}
      onSubmit={onSubmit}
      createSubmitLabel={numberOfItems =>
        numberOfItems > 0 ? `Add ${numberOfItems} Channel${numberOfItems > 1 ? 's' : ''}` : 'Add'
      }
      requiresAtLeastOneMessage="Please select at least one alert channel."
      pageSize={5}
      listFormGroupClassOverwrites={locals.alertChannelsList}
      tableScrollWrapperClassOverwrites={locals.alertChannelsList}
    />
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

SelectAlertChannelPresenter.propTypes = {
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};
