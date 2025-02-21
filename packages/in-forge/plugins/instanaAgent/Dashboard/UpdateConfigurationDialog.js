/*
 * (c) Copyright IBM Corp. 2024
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
// @ts-ignore
// temp yaml hack
import SampleConfig from 'in-visualize/SampleConfig.yaml';
import ConfigFlowChart from 'in-visualize/components/ConfigFlowChart';
import ConfigEditor from 'in-visualize/components/ConfigEditor';
import { close } from 'in-components/DialogPresenter/store';
import Dialog from 'in-components/Dialog/Dialog';
import { t } from 'in-i18n';

export default function UpdateConfigurationDialog() {
  const [config, setConfig] = useState(SampleConfig);

  const handleConfigChange = updatedConfig => {
    setConfig(updatedConfig);
  };

  return (
    <Dialog title={t('in-forge:plugins.instanaAgent.dashboard.updateConfig')} onClose={close}>
      <HorizontalFlexWrapper style={{ height: '100vh', width: '150vh' }}>
        <ConfigEditor agentConfig={config} handleAgentConfigChange={handleConfigChange} />
        <ConfigFlowChart config={config} />
      </HorizontalFlexWrapper>
    </Dialog>
  );
}
