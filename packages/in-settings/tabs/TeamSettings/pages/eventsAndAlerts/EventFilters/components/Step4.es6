import React, { Fragment } from 'react';
import { List } from 'immutable';

import SelectChannelsButton from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/EventFilters/components/SelectChannelsButton';
import AlertChannels from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/AlertChannels/AlertChannels';
import SectionHeading from 'in-settings/components/SectionHeading';
import { getIntegrationsByIdsMutable } from 'in-api/integrations';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { alwaysEmptyArray } from 'in-services/fixedStreams';

export default function Step4({ form, setForm }) {
  const selectedChannels = form.get('integrationIds') ? form.get('integrationIds').value : List();

  return (
    <Fragment>
      <SectionHeading>4. Alerting</SectionHeading>
      <AlertChannels
        setTitle={false}
        loadEntities={() => getSelectedAlertChannels(selectedChannels)}
        noDataMessage="No Alert Channels Selected"
        hasRowNavigation={false}
        tableActions={alertChannelSelectionTableActions(form, setForm)}
        rightHeader={<SelectChannelsButton />}
      />
      <TouchedMessages field={form.get('integrationIds')} />
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
          form = form.updateIn(['integrationIds'], field => {
            return field.setValue(field.value.filterNot(referencedId => referencedId === deselectedEntity.id));
          });
          setForm(form);
        }
      }
    }
  };
}
