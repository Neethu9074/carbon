/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import CopyToClipboardButton from 'in-components/CopyToClipboardButton';
import { close } from 'in-components/DialogPresenter/store';
import Dialog from 'in-components/Dialog/Dialog';
import connectTo from 'in-hoc/connectTo';
import Code from 'in-components/Code';
import { t } from 'in-i18n';

import locals from './PackageRetrievalDialog.mless';

export default connectTo(
  props => {
    return {
      response: props.agentResponse$
    };
  },
  function CodeDialog({ packageName, response, lang }) {
    let header;
    if (response && !response.error) {
      header = <CopyToClipboardButton kind="secondary" size="compact" getText={() => response.data} />;
    }

    return (
      <Dialog
        title={`${t('in-forge:plugins.packageRetrieval.package')}: ${packageName}`}
        onClose={close}
        renderCustomCloseBehaviour={() => header}
      >
        {!response ? <LoadingIndicator /> : null}

        {response && response.error ? (
          <DashboardNotification type="danger">
            {t('in-forge:plugins.labelError')}: {response.error}
          </DashboardNotification>
        ) : null}

        {response && response.data ? (
          <Code
            lang={lang}
            line="0"
            code={response.data}
            className={locals.code}
            showLineNumbers={lang !== 'java'}
            scrollElementClassName={locals.content}
            withoutCopyButton
          />
        ) : null}
      </Dialog>
    );
  }
);
