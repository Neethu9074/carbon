import React from 'react';

import { loadRawAgentConfiguration } from 'in-forge/plugins/instanaAgent/selfMonitoring';
import CopyToClipboardButton from 'in-components/CopyToClipboardButton';
import DashboardNotification from 'in-components/DashboardNotification';
import FlexHeader from 'in-components/Dialog/components/FlexHeader';
import LoadingIndicator from 'in-components/LoadingIndicator';
import { close } from 'in-components/DialogPresenter/store';
import Dialog from 'in-components/Dialog';
import connectTo from 'in-hoc/connectTo';
import Code from 'in-components/Code';

import locals from './AgentConfiguration.mless';

export default connectTo(
  ({ snapshot }) => ({ response: loadRawAgentConfiguration(snapshot) }),
  function AgentConfiguration({ response }) {
    const codeTargetId = 'agentConfiguration';

    const header = response ? (
      <FlexHeader>
        Agent Configuration
        <CopyToClipboardButton targetId={codeTargetId} />
      </FlexHeader>
    ) : (
      'Retrieving agent configuration…'
    );

    return (
      <Dialog header={header} onClose={close} contentClassName={locals.dialog}>
        {!response && <LoadingIndicator type="dark" />}

        {response &&
          response.error && <DashboardNotification type="danger">Error: {response.error}</DashboardNotification>}

        {response && <Code code={response.data} showLineNumbers={false} id={codeTargetId} lang="yaml" />}
      </Dialog>
    );
  }
);
