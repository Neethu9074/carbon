/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';
import { fromJS } from 'immutable';

import createMemoizedObservableForReferencedEntities from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Alerts/components/memoizeReferencedEntitiesObservable';
import AlertChannelsList, {
  noRightHeader
} from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/AlertChannels/AlertChannelsList';
import { limitForConnectedAlertChannels } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Alerts/Alert';
import SelectListDialogButton from 'in-settings/tabs/TeamSettings/components/SelectListDialogButton';
import { getAlertChannelsInfosMutable } from 'in-api/alertChannels';
import SectionHeading from 'in-settings/components/SectionHeading';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { alwaysEmptyArray } from 'in-services/fixedStreams';
import { t } from 'in-i18n';

export default function Step4({ form, setForm }) {
  const selectedChannels = form.get('selectedAlertChannels') ? form.get('selectedAlertChannels').value.toJS() : [];

  return (
    <Fragment>
      <div style={{ marginTop: '2rem' }} />
      <SectionHeading>{t('in-settings:tabs.4Alerting')}</SectionHeading>
      <AlertChannelsList
        setTitle={false}
        loadEntities={() => getSelectedAlertChannels(selectedChannels)}
        hasRowNavigation={false}
        noDataMessage={t('in-settings:tabs.noAlertChannelsSelected')}
        tableActions={alertChannelSelectionTableActions(form, setForm)}
        rightHeader={
          <SelectListDialogButton
            form={form}
            onSubmit={selectedIds => submitChannelSelection(form, setForm, selectedIds)}
            title={t('in-settings:tabs.addAlertChannels')}
            label={t('in-settings:tabs.addAlertChannels')}
            listComponent={AlertChannelsList}
            listComponentRightHeader={noRightHeader}
            hiddenIds={form.get('selectedAlertChannels').value.toJS()}
            limit={limitForConnectedAlertChannels}
            createSubmitLabel={numberOfItems =>
              numberOfItems > 0
                ? t('in-settings:tabs.addNumberOfItemsChannel', { count: numberOfItems })
                : t('in-settings:tabs.add')
            }
            requiresAtLeastOneMessage={t('in-settings:tabs.pleaseSelectAtLeastOneAlertChannel')}
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
  return getAlertChannelsInfosMutable(selectedChannels).startWith(null);
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
