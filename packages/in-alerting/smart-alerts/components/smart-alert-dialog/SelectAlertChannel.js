/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import createMemoizedObservableForReferencedEntities from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Alerts/components/memoizeReferencedEntitiesObservable';
import AlertChannelsList, {
  noRightHeader
} from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/AlertChannels/AlertChannelsList';
import { limitForConnectedAlertChannels } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Alerts/Alert';
import SelectListDialogContentComponent from 'in-settings/tabs/TeamSettings/components/SelectListDialogContent';
import NoChannelSelected from 'in-alerting/components/NoChannelSelected';
import { getAlertChannelsInfosMutable } from 'in-api/alertChannels';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { alwaysEmptyArray } from 'in-services/fixedStreams';
import Button from 'in-new-components/Button';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/smart-alert-dialog/SelectAlertChannel.mless';

export default function SelectAlertChannel({ form, onChange, setAlertChannelsVisible }) {
  return (
    <>
      <AlertChannelsList
        setTitle={false}
        loadEntities={() => getSelectedAlertChannels(form.get('alertChannelIds').value)}
        hasRowNavigation={false}
        renderNoDataAvailable={() => <NoChannelSelected />}
        tableActions={alertChannelSelectionTableActions(form, onChange)}
        rightHeader={
          <Button
            className={locals.selectButton}
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
                  title: t('in-alerting:smartAlerts.components.smartAlertDialog.selectAlertChannelButtonTitle')
                },
                isVisible: true
              })
            }
            icon="lib_openclose_add_circle_outline"
          >
            {t('in-alerting:smartAlerts.components.smartAlertDialog.selectAlertChannelButton')}
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
      listComponent={AlertChannelsList}
      listComponentRightHeader={noRightHeader}
      hiddenIds={form.get('alertChannelIds').value}
      limit={limitForConnectedAlertChannels}
      onSubmit={onSubmit}
      createSubmitLabel={numberOfItems =>
        numberOfItems > 0 ? `Add ${numberOfItems} Channel${numberOfItems > 1 ? 's' : ''}` : 'Add'
      }
      pageSize={5}
      preventCloseOnSubmit
    />
  );
}

const getSelectedAlertChannels = createMemoizedObservableForReferencedEntities(function(selectedChannels) {
  if (selectedChannels.length === 0) {
    return alwaysEmptyArray;
  }
  // null is treated as a pending result when converting the HTTP response into a result
  return getAlertChannelsInfosMutable(selectedChannels).startWith(null);
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
