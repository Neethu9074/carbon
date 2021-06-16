/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import createAgentResponseObservable from 'in-subscription/agentResponse';
import CopyToClipboardButton from 'in-components/CopyToClipboardButton';
import { close } from 'in-components/DialogPresenter/store';
import Dialog from 'in-components/Dialog/Dialog';
import connectTo from 'in-hoc/connectTo';
import Code from 'in-components/Code';
import { t } from 'in-i18n';

export default connectTo(
  ({ snapshot }) => ({
    response: createAgentResponseObservable({
      action: 'docker.containerInfo',
      target: snapshot.get('volatileId'),
      args: {
        containerId: snapshot.getIn(['data', 'Id'])
      }
    })
  }),
  function CodeDialog({ response }) {
    const codeTargetId = 'codeContainerInfo';
    let header;
    if (response && !response.error) {
      header = <CopyToClipboardButton kind="secondary" size="compact" targetId={codeTargetId} />;
    }

    return (
      <Dialog
        title={t('in-forge:plugins.docker.containerInfo')}
        onClose={close}
        renderCustomCloseBehaviour={() => header}
      >
        {!response && <LoadingIndicator />}

        {response && response.error && (
          <DashboardNotification type="danger">Error: {response.error}</DashboardNotification>
        )}

        {response && response.data && (
          <Code
            code={JSON.stringify(JSON.parse(response.data), null, 2)}
            id={codeTargetId}
            lang="json"
            withoutCopyButton
          />
        )}
      </Dialog>
    );
  }
);
