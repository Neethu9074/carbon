/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useState } from 'react';

import { CarbonModal as Modal } from '@instana/components';

// @ts-ignore
// temp yaml file import until collector management integration
import SampleConfig from 'in-infrastructure/agentView/ConfigurationEditor/SampleConfig.yaml';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
import ConfigFlowChart from 'in-infrastructure/agentView/ConfigurationEditor/ConfigFlowChart';
import ConfigEditor from 'in-infrastructure/agentView/ConfigurationEditor/ConfigEditor';
import { otelCollectorConfigEditorEnabled } from 'in-services/featureFlags';
import { close } from 'in-components/DialogPresenter/store';
import Dialog from 'in-components/Dialog/Dialog';
import { t } from 'in-i18n';

import locals from './UpdateConfigurationDialog.mless';

export default function UpdateConfigurationDialog() {
  const [config, setConfig] = useState(SampleConfig);

  const handleConfigChange = updatedConfig => {
    setConfig(updatedConfig);
  };

  return (
    otelCollectorConfigEditorEnabled && (
      <Modal
        // className={locals.editorDialog}
        modalHeading={t('in-infrastructure:collectorView.updateConfig')}
        onRequestClose={close}
        open
      >
        <HorizontalFlexWrapper>
          <ConfigEditor agentConfig={config} handleAgentConfigChange={handleConfigChange} />
          <ConfigFlowChart config={config} />
        </HorizontalFlexWrapper>
      </Modal>
    )
  );
}
