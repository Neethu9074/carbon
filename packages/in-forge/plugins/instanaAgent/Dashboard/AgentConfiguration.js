/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { loadRawAgentConfiguration } from 'in-forge/plugins/instanaAgent/selfMonitoring';
import LoadingIndicator from 'in-new-components/LoadingIndicators/LoadingIndicator';
import CopyToClipboardButton from 'in-new-components/CopyToClipboardButton';
import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import { close } from 'in-components/DialogPresenter/store';
import Dialog from 'in-new-components/Dialog/Dialog';
import connectTo from 'in-hoc/connectTo';
import Code from 'in-components/Code';

import locals from './AgentConfiguration.mless';

export default connectTo(
  ({ snapshot }) => ({ response: loadRawAgentConfiguration(snapshot) }),
  function AgentConfiguration({ response }) {
    const codeTargetId = 'agentConfiguration';
    const header = response && <CopyToClipboardButton kind="secondary" size="compact" targetId={codeTargetId} />;

    return (
      <Dialog
        className={locals.dialog}
        title="Agent Configuration"
        renderCustomCloseBehaviour={() => header}
        onClose={close}
      >
        {!response && <LoadingIndicator />}

        {response && response.error && (
          <DashboardNotification type="danger">Error: {response.error}</DashboardNotification>
        )}

        {response && <Code code={response.data} showLineNumbers={false} id={codeTargetId} lang="yaml" />}
      </Dialog>
    );
  }
);
