/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment, useMemo } from 'react';
import { fromJS } from 'immutable';
import { filter } from 'lodash';

import { Checkbox, Typography } from '@instana/components';

import AlertChannelsList, {
  noRightHeader
} from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/AlertChannels/AlertChannelsList';
import { limitForConnectedAlertChannels } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Alerts/Alert';
import SelectListDialogButton from 'in-settings/tabs/GlobalSettings/components/SelectListDialogButton';
import { getAlertChannelsInfosMutable } from 'in-api/alertChannels';
import SectionHeading from 'in-settings/components/SectionHeading';
import DescriptionText from 'in-components/form/DescriptionText';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { alwaysEmptyArray } from 'in-services/fixedStreams';
import { t } from 'in-i18n';

export default function Step4({ form, setForm }) {
  const selectedChannels = form.get('selectedAlertChannels') ? form.get('selectedAlertChannels').value.toJS() : [];
  const includeEntityNameInLegacyAlerts = form.get('includeEntityNameInLegacyAlerts')?.value ?? false;
  const alertChannelInfos = useMemo(() => {
    return getAlertChannelsInfosMutable();
  }, []);

  return (
    <Fragment>
      <div style={{ marginTop: '2rem' }} />
      <SectionHeading>{t('in-settings:tabs.4Alerting')}</SectionHeading>
      <AlertChannelsList
        setTitle={false}
        loadEntities={() => getSelectedAlertChannels(selectedChannels, alertChannelInfos)}
        hasRowNavigation={false}
        noDataMessage={t('in-settings:tabs.noAlertChannelsSelected')}
        tableActions={alertChannelSelectionTableActions(form, setForm)}
        rightHeader={
          <SelectListDialogButton
            form={form}
            onSubmit={selectedIds => submitChannelSelection(form, setForm, selectedIds)}
            title={t('in-settings:tabs.addAlertChannels')}
            label={t('in-settings:tabs.addAlertChannels')}
            listComponent={props => <AlertChannelsList {...props} loadEntities={() => alertChannelInfos} />}
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
      <Typography variant="heading-200">{t('in-settings:tabs.alertTitleAdditions')}</Typography>
      <Checkbox
        checked={includeEntityNameInLegacyAlerts}
        label={t('in-settings:tabs.includeEntityNameInLegacyAlerts')}
        onChange={ev =>
          setForm(form.updateIn(['includeEntityNameInLegacyAlerts'], field => field.setValue(ev.target.checked)))
        }
      />
      <DescriptionText>{t('in-settings:tabs.alertTitleAdditionsTooltip')}</DescriptionText>
      <TouchedMessages field={form.get('selectedAlertChannels')} />
    </Fragment>
  );
}

function getSelectedAlertChannels(selectedChannels, alertChannelInfos) {
  if (selectedChannels.length === 0) {
    return alwaysEmptyArray;
  }
  return alertChannelInfos.map(channels =>
    filter(channels, function (channel) {
      return selectedChannels.indexOf(channel.id) >= 0;
    })
  );
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
      return field.setValue(field.value.concat(fromJS(selectedIds)));
    })
  );
}
