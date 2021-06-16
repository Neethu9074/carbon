/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { loadRawAgentConfiguration } from 'in-forge/plugins/instanaAgent/selfMonitoring';
import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import CopyToClipboardButton from 'in-components/CopyToClipboardButton';
import { close } from 'in-components/DialogPresenter/store';
import Dialog from 'in-components/Dialog/Dialog';
import connectTo from 'in-hoc/connectTo';
import Code from 'in-components/Code';
import { t } from 'in-i18n';

import locals from './AgentConfiguration.mless';

export default connectTo(
  ({ snapshot }) => ({ response: loadRawAgentConfiguration(snapshot) }),
  function AgentConfiguration({ response }) {
    const codeTargetId = 'agentConfiguration';
    const header = response && <CopyToClipboardButton kind="secondary" size="compact" targetId={codeTargetId} />;

    return (
      <Dialog
        className={locals.dialog}
        title={t('in-forge:plugins.instanaAgent.dashboard.agentConfiguration')}
        renderCustomCloseBehaviour={() => header}
        onClose={close}
      >
        {!response && <LoadingIndicator />}

        {response && response.error && (
          <DashboardNotification type="danger">
            {t('in-forge:plugins.instanaAgent.dashboard.error', { error: response.error })}
          </DashboardNotification>
        )}

        {response && (
          <Code code={response.data} showLineNumbers={false} id={codeTargetId} lang="yaml" withoutCopyButton />
        )}
      </Dialog>
    );
  }
);
