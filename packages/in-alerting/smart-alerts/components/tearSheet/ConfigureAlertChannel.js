/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';

import { useObservable } from '@instana/hooks';
import { Button } from '@instana/components';

import AlertChannelSelectListTearsheet from 'in-alerting/smart-alerts/components/tearSheet/AlertChannelSelectListTearsheet';
import { limitForConnectedAlertChannels } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Alerts/Alert';
import { channelListLoading$ } from 'in-alerting/smart-alerts/components/tearSheet/AlertChannelsList';
import AlertChannelCreation from 'in-alerting/smart-alerts/components/dialog/AlertChannelCreation';
import AlertChannelsList from 'in-alerting/smart-alerts/components/tearSheet/AlertChannelsList';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { getAlertChannelsInfosMutable } from 'in-api/alertChannels';
import TouchedMessages from 'in-components/form/TouchedMessages';
import Dialog from 'in-components/Dialog/Dialog';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/tearSheet/ConfigureAlertChannel.mless';

export default function ConfigureAlertChannel({ form, onChange, numberOfAlertChannelListRows = 5 }) {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const entityResult = useGetChannlelist(createDialogOpen);
  channelListLoading$.emit(entityResult?.length ?? undefined);

  return (
    <>
      <AlertChannelSelectListTearsheet
        listComponent={AlertChannelsList}
        entityResult={entityResult}
        selectedChannels={form.get('alertChannelIds').value ?? []}
        onSelectionUpdate={selectedIds => {
          onChange(['alertChannelIds'], field => field.setValue(selectedIds).setTouched(true));
        }}
        listComponentRightHeader={
          role.canConfigureIntegrations && (
            <Button
              className={locals.createAlertChannelButton}
              kind="action"
              icon="lib_openclose_add"
              onClick={() => {
                setCreateDialogOpen(true);
                addActiveDialog(
                  <Dialog
                    title={t('in-alerting:smartAlerts.components.smartAlertDialog.createAlertChannelTitle')}
                    onClose={() => {
                      close();
                    }}
                    className={locals.channelDialogWidth}
                  >
                    <AlertChannelCreation
                      onCancel={() => {
                        close();
                      }}
                      isTearsheet
                      setCreateDialogOpen={setCreateDialogOpen}
                    />
                  </Dialog>
                );
              }}
            >
              {t('in-alerting:smartAlerts.components.smartAlertDialog.createAlertChannelTitle')}
            </Button>
          )
        }
        limit={limitForConnectedAlertChannels}
        pageSize={numberOfAlertChannelListRows}
        preventCloseOnSubmit
      />
      <TouchedMessages field={form.get('alertChannelIds')} />
    </>
  );
}

function useGetChannlelist(createDialogOpen) {
  const oldData = useMemo(() => {
    return getAlertChannelsInfosMutable().startWith(null);
  }, []);

  return useObservable(() => {
    // update channel list whenever dialog is closed.
    if (!createDialogOpen) {
      return getAlertChannelsInfosMutable().startWith(null);
    }
    return oldData;
  }, [createDialogOpen]);
}

ConfigureAlertChannel.propTypes = {
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  numberOfAlertChannelListRows: PropTypes.number
};
