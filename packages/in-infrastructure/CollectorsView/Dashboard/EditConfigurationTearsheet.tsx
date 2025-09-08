/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import * as yamlMode from '@codemirror/legacy-modes/mode/yaml';
import React, { useEffect, useRef, useState } from 'react';
import { StreamLanguage } from '@codemirror/language';
import CodeMirror from '@uiw/react-codemirror';

import { Tearsheet } from '@instana/ibm-products';
import { useObservable } from '@instana/hooks';
import { Modal } from '@instana/carbon';

import { loadRawAgentConfigurationOtel, updateOTelConfiguration } from 'in-forge/plugins/instanaAgent/selfMonitoring';
import { UpdateConfigErrorMessage } from 'in-infrastructure/CollectorsView/Dashboard/NotificationMessages';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
import ConfigFlowChart from 'in-infrastructure/CollectorsView/ConfigurationEditor/ConfigFlowChart';
import { SnapshotItem } from 'in-infrastructure/CollectorsView/Dashboard/CollectorDashboard';
import { LoadingIndicator } from 'in-components/LoadingIndicators';
import { close } from 'in-components/DialogPresenter/store';
import { t } from 'in-i18n';

import locals from './CollectorDashboard.mless';

export default function EditConfigurationTearsheet({ snapshot }: { snapshot: SnapshotItem }) {
  const [config, setConfig] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const configLoadedRef = useRef(false);

  const currentConfig = useObservable(() => {
    if (snapshot && !configLoadedRef.current) {
      configLoadedRef.current = true; // Mark as loaded to prevent re-runs when config is cleared
      return loadRawAgentConfigurationOtel(snapshot);
    }
    return null;
  }, [snapshot]);

  useEffect(() => {
    if (currentConfig && currentConfig.data) {
      setConfig(currentConfig.data);
    }
  }, [currentConfig]);

  const handleConfigChange = (updatedConfig: string) => {
    setConfig(updatedConfig);
  };

  const handleCancelUpdate = () => {
    if (config === currentConfig?.data) {
      close();
    } else {
      setShowUnsavedModal(true);
    }
  };

  return (
    // @ts-expect-error
    <Tearsheet
      open
      title={t('in-infrastructure:collectorView.editConfig.updateConfiguration')}
      description={snapshot.get('label')}
      onClose={handleCancelUpdate}
      className={locals.tearsheet}
      actions={[
        {
          key: 'cancel',
          kind: 'secondary',
          label: t('forms.actions.cancel'),
          onClick: handleCancelUpdate
        },
        {
          key: 'update',
          kind: 'primary',
          label: t('in-infrastructure:collectorView.editConfig.update'),
          onClick: () => {
            if (config === currentConfig?.data) {
              setErrorMsg('No changes detected');
            } else {
              updateOTelConfiguration(snapshot, config, close, setErrorMsg);
            }
          }
        }
      ]}
    >
      {errorMsg && <UpdateConfigErrorMessage error={errorMsg} setErrorMsg={setErrorMsg} />}
      {!currentConfig && <LoadingIndicator />}
      {currentConfig && (
        <HorizontalFlexWrapper className={locals.editorDialog}>
          <CodeMirror
            value={config}
            extensions={[StreamLanguage.define(yamlMode.yaml)]}
            height="70.75vh"
            width="40rem"
            onChange={handleConfigChange}
          />
          <ConfigFlowChart config={config} />
        </HorizontalFlexWrapper>
      )}
      {showUnsavedModal && (
        <Modal
          open
          modalHeading={t('in-infrastructure:collectorView.editConfig.leaveWithoutSaving')}
          className={locals.tearsheet}
          primaryButtonText={t('in-infrastructure:collectorView.editConfig.leave')}
          secondaryButtonText={t('forms.actions.cancel')}
          onRequestClose={() => setShowUnsavedModal(false)}
          onRequestSubmit={() => {
            setShowUnsavedModal(false);
            close();
          }}
          onSecondarySubmit={() => setShowUnsavedModal(false)}
        >
          <p>{t('in-infrastructure:collectorView.editConfig.lostChanges')}</p>
        </Modal>
      )}
    </Tearsheet>
  );
}
