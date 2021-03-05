/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import LoadingIndicator from 'in-new-components/LoadingIndicators/LoadingIndicator';
import createAgentResponseObservable from 'in-subscription/agentResponse';
import CopyToClipboardButton from 'in-new-components/CopyToClipboardButton';
import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import { close } from 'in-components/DialogPresenter/store';
import Dialog from 'in-new-components/Dialog/Dialog';
import connectTo from 'in-hoc/connectTo';
import Code from 'in-components/Code';

export default connectTo(
  props => {
    return {
      response: createAgentResponseObservable({
        action: 'java.threadDump',
        target: props.snapshot.get('volatileId'),
        args: {}
      })
    };
  },
  function CodeDialog({ response }) {
    const codeTargetId = 'codeThreadDump';
    let header;
    if (response && !response.error) {
      header = <CopyToClipboardButton kind="secondary" size="compact" targetId={codeTargetId} />;
    }

    return (
      <Dialog
        title={t('in-forge:plugins.jvmRuntimePlatform.threadDump')}
        onClose={close}
        renderCustomCloseBehaviour={() => header}
      >
        {!response && <LoadingIndicator />}

        {response && response.error && (
          <DashboardNotification type="danger">Error: {response.error}</DashboardNotification>
        )}

        {response && response.data && <Code code={response.data} id={codeTargetId} />}
      </Dialog>
    );
  }
);
