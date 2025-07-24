/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import * as yamlMode from '@codemirror/legacy-modes/mode/yaml';
import { StreamLanguage } from '@codemirror/language';
import React, { useEffect, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';

import { Modal, ToastNotification } from '@instana/carbon';
import { useObservable } from '@instana/hooks';

import { loadRawAgentConfiguration, updateOTelConfiguration } from 'in-forge/plugins/instanaAgent/selfMonitoring';
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
  const currentConfig = useObservable(() => (snapshot ? loadRawAgentConfiguration(snapshot) : undefined), [snapshot]);
  const [config, setConfig] = useState(currentConfig?.data);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setConfig(currentConfig?.data);
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
          title={t('in-infrastructure:collectorView.collectorError')}
          subtitle={errorMsg}
          onCloseButtonClick={() => {
            //clear error message when closed
            setErrorMsg('');
          }}
        />
      )}
      {!config && <LoadingIndicator />}
      {config && (
        <HorizontalFlexWrapper className={locals.editorDialog}>
          <CodeMirror
            value={config ?? ''}
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
