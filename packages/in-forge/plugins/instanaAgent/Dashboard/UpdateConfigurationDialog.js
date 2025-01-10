/*
 * (c) Copyright IBM Corp. 2024
 * (c) Copyright Instana Inc.
 */

import { ReactFlowProvider } from 'reactflow';
import React from 'react';

import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
import ConfigEditor from 'in-visualize/components/ConfigEditor';
import Flow from 'in-visualize/components/ReactFlow/ReactFlow';
import { close } from 'in-components/DialogPresenter/store';
import Dialog from 'in-components/Dialog/Dialog';
import { t } from 'in-i18n';

export default function UpdateConfigurationDialog() {
  return (
    <Dialog title={t('in-forge:plugins.instanaAgent.dashboard.updateConfig')} onClose={close}>
      <ReactFlowProvider>
        <HorizontalFlexWrapper style={{ height: '100vh', width: '150vh' }}>
          <ConfigEditor />
          <Flow />
        </HorizontalFlexWrapper>
      </ReactFlowProvider>
    </Dialog>
  );
}
