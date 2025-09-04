/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import * as yamlMode from '@codemirror/legacy-modes/mode/yaml';
import React, { useEffect, useState, useRef } from 'react';
import { StreamLanguage } from '@codemirror/language';
import CodeMirror from '@uiw/react-codemirror';

import { Modal, ToastNotification } from '@instana/carbon';
import { useObservable } from '@instana/hooks';

import { loadRawAgentConfigurationOtel, updateOTelConfiguration } from 'in-forge/plugins/instanaAgent/selfMonitoring';
//@ts-expect-error TS migration
import { selectedSnapshot$, SnapshotData } from 'in-stores/snapshot';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
import ConfigFlowChart from 'in-infrastructure/CollectorsView/ConfigurationEditor/ConfigFlowChart';
import { LoadingIndicator } from 'in-components/LoadingIndicators';
import { close } from 'in-components/DialogPresenter/store';
import { t } from 'in-i18n';

import locals from './CollectorDashboard.mless';

export default function EditConfigurationDialog() {
  const snapshot = useObservable(selectedSnapshot$, []) as SnapshotData;
  const [config, setConfig] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
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

  function getErrorMessage(data: string) {
    // Extract just the error message part
    const regex = /(Error:.*?)(?=\s*\d{4}\/\d{2}\/\d{2})/;
    const match = data.match(regex);

    if (match && match[1]) {
      // If match found, use the extracted error
      setErrorMsg(match[1].trim());
    } else {
      // display whole message if no match
      setErrorMsg(data);
    }
  }

  return (
    <Modal
      title={t('in-infrastructure:collectorView.collectorConfig')}
      onRequestClose={close}
      primaryButtonText={t('in-infrastructure:collectorView.update')}
      secondaryButtonText={t('in-infrastructure:collectorView.cancel')}
      onRequestSubmit={() => {
        updateOTelConfiguration(snapshot, config, close, getErrorMessage);
      }}
      modalHeading={t('in-infrastructure:collectorView.configuration')}
      modalLabel={snapshot?.get('label')}
      className={locals.modal}
      open
    >
      {errorMsg && (
        <ToastNotification
          className={locals.configErrorToast}
          title={t('in-infrastructure:collectorView.errors.updateFailed')}
          //using type any as a workaround for required string data type
          subtitle={errorMsg}
          onCloseButtonClick={() => {
            //clear error message when closed
            setErrorMsg('');
          }}
        />
      )}
      {!currentConfig && <LoadingIndicator />}
      {currentConfig && (
        <HorizontalFlexWrapper className={locals.editorDialog}>
          <CodeMirror
            value={config}
            extensions={[StreamLanguage.define(yamlMode.yaml)]}
            height="98vh"
            width="30rem"
            onChange={handleConfigChange}
          />
          <ConfigFlowChart config={config} />
        </HorizontalFlexWrapper>
      )}
    </Modal>
  );
}
