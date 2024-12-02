/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useRef, useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { Message } from '@instana/components';
import { Select } from '@instana/components';
import { Stack } from '@instana/components';

import AlertChannelModificationForm, {
  createForm,
  save
} from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/AlertChannels/components/AlertChannelModificationForm';
import configs from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/AlertChannels/configs';
import DialogFooter from 'in-components/BlueprintFormMultistep/DialogFooter';
import { createAlertChannel, getAlertChannel } from 'in-api/alertChannels';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import AlertSection from 'in-alerting/components/AlertSection';
import { close } from 'in-components/DialogPresenter/store';
import Sections from 'in-components/workspace/Sections';
import SaveButton from 'in-components/form/SaveButton';
import { t } from 'in-i18n';

import locals from './AlertChannelCreation.mless';

export default function AlertChannelCreation({
  onCancel,
  isTearsheet,
  setCreateDialogOpen,
  alertChannelPerSeverityEnabled
}) {
  const alertChannelConfigKeys = Object.keys(configs);

  const [selectedAlertChannelKey, setSelectedAlertChannelKey] = useState(alertChannelConfigKeys[0]);
  const [message, setMessage] = useState();
  const [resetKey, setResetKey] = useState({});

  const resetForm = () => setResetKey(Math.random());

  const formFooterRef = useRef();

  return (
    <div
      style={{
        height: `calc(100% - ${formFooterRef.current?.offsetHeight ?? 0}px - 1rem)`,
        overflowY: 'auto'
      }}
    >
      <Stack>
        <Sections>
          <AlertSection
            titleHtmlFor="select-alert-channel"
            title={t('in-alerting:smartAlerts.components.smartAlertDialog.alertChannelSelectTypeTitle')}
          >
            <Select
              id="select-alert-channel"
              value={selectedAlertChannelKey}
              onChange={e => {
                setSelectedAlertChannelKey(e.target.value);
                resetForm();
              }}
            >
              {alertChannelConfigKeys.map(configKey => {
                const label = configs[configKey].label;
                return (
                  <option key={configKey} value={configKey}>
                    {label}
                  </option>
                );
              })}
            </Select>
          </AlertSection>
        </Sections>

        <div
          className={classNames({
            [locals.formWrapper]: true,
            [locals.alertChannelInTearSheet]: isTearsheet
          })}
          key={resetKey}
        >
          <AlertChannelConfigForm
            onCancel={onCancel}
            selectedAlertChannelKey={selectedAlertChannelKey}
            handleSaveSuccess={() => {
              addMessage({
                type: 'info',
                timeout: 5000,
                title: t('in-alerting:smartAlerts.components.smartAlertDialog.alertChannelCreatedSuccess'),
                content: t('in-alerting:smartAlerts.components.smartAlertDialog.alertChannelCreatedSuccessDescription')
              });
              resetForm();
              if (isTearsheet && !alertChannelPerSeverityEnabled) {
                setCreateDialogOpen(false);
                close();
              } else {
                onCancel();
              }
            }}
            handleSaveError={errorMessage =>
              setMessage({
                type: 'error',
                text: errorMessage
              })
            }
            formFooterRef={formFooterRef}
          />
        </div>

        {message && (
          <Message type={message.type} small withIcon>
            {message.text}
          </Message>
        )}
      </Stack>
    </div>
  );
}

AlertChannelCreation.propTypes = {
  onCancel: PropTypes.func.isRequired,
  isTearsheet: PropTypes.bool,
  setCreateDialogOpen: PropTypes.func,
  alertChannelPerSeverityEnabled: PropTypes.bool
};

function AlertChannelConfigForm({
  selectedAlertChannelKey,
  onCancel,
  handleSaveSuccess,
  handleSaveError,
  formFooterRef
}) {
  return (
    <AlertChannelModificationForm
      key={selectedAlertChannelKey}
      title={t('in-settings:tabs.alertChannel')}
      createDefaultEntity={() => createAlertChannel(null, selectedAlertChannelKey)}
      createForm={createForm}
      getEntityFromApi={getAlertChannel}
      saveEntity={save}
      renderCustomFormActions={({ form, loading }) => {
        const isSaving = loading;
        return (
          <DialogFooter
            form={form}
            onSecondaryActionClick={onCancel}
            secondaryActionText={t('in-alerting:smartAlerts.components.smartAlertDialog.cancelTitle')}
            renderCustomSaveAction={() => (
              <SaveButton
                type="submit"
                kind="create"
                form={form}
                disabled={(!form.hierarchyValid && form.touched) || isSaving}
                isSaving={isSaving}
              >
                {t('in-alerting:smartAlerts.components.smartAlertDialog.createAlertChannelTitle')}
              </SaveButton>
            )}
            ref={formFooterRef}
          />
        );
      }}
      onSaveSuccess={handleSaveSuccess}
      onSaveError={handleSaveError}
    />
  );
}
