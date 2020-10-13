import PropTypes from 'prop-types';
import React from 'react';

import createMemoizedObservableForReferencedEntities from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Alerts/components/memoizeReferencedEntitiesObservable';
import AlertChannels, {
  noRightHeader
} from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/AlertChannels/AlertChannels';
import { limitForConnectedAlertChannels } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Alerts/Alert';
import SelectListDialogContentComponent from 'in-settings/tabs/TeamSettings/components/SelectListDialogContent';
import NoChannelSelected from 'in-new-components/Alerting/components/channels/NoChannelSelected';
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
        loadEntities={() => getSelectedAlertChannels(form.get('alertChannelIds').value)}
        hasRowNavigation={false}
        renderNoDataAvailable={() => <NoChannelSelected />}
        tableActions={alertChannelSelectionTableActions(form, onChange)}
        rightHeader={
          <Button
            kind="action"
            onClick={() =>
              setAlertChannelsVisible({
                slideInConfig: {
                  component: (
                    <SelectListDialogContent
                      reloadKey={Math.random()} // Force component to rerender. This is needed to not have an old state when deselcting an item
                      form={form}
                      onSubmit={selectedIds => {
                        const currentAlertChannelIds = form.get('alertChannelIds').value ?? [];
                        onChange(['alertChannelIds'], field =>
                          field.setValue(currentAlertChannelIds.concat(selectedIds)).setTouched(true)
                        );
                        setAlertChannelsVisible({ isVisible: false });
                      }}
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
      <TouchedMessages field={form.get('alertChannelIds')} />
    </>
  );
}

function SelectListDialogContent({ form, onSubmit, reloadKey }) {
  return (
    <SelectListDialogContentComponent
      key={reloadKey}
      listComponent={AlertChannels}
      listComponentRightHeader={noRightHeader}
      hiddenIds={form.get('alertChannelIds').value}
      limit={limitForConnectedAlertChannels}
      onSubmit={onSubmit}
      createSubmitLabel={numberOfItems =>
        numberOfItems > 0 ? `Add ${numberOfItems} Channel${numberOfItems > 1 ? 's' : ''}` : 'Add'
      }
      pageSize={5}
      listFormGroupClassOverwrites={locals.alertChannelsList}
      tableScrollWrapperClassOverwrites={locals.alertChannelsList}
      preventCloseOnSubmit
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
          const value = form.get('alertChannelIds').value.filter(referencedId => referencedId !== deselectedEntity.id);
          onChange(['alertChannelIds'], field => field.setValue(value).setTouched(true));
        }
      }
    }
  };
}

SelectAlertChannel.propTypes = {
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  setAlertChannelsVisible: PropTypes.func.isRequired
};
