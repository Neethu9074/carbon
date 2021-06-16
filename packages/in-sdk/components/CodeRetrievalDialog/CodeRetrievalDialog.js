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

import locals from './CodeRetrievalDialog.mless';

export default connectTo(
  props => {
    return {
      response: props.agentResponse$
    };
  },
  function CodeRetrievalDialog({ file, response, lang, line }) {
    const hasLine = line != null && !isNaN(parseInt(line, 10));

    let header;
    if (response && !response.error) {
      header = <CopyToClipboardButton kind="secondary" size="compact" getText={() => response.data} />;
    }

    return (
      <Dialog
        title={`File: ${file} ${hasLine ? `- Line: ${line}` : ''}`}
        onClose={close}
        renderCustomCloseBehaviour={() => header}
      >
        {!response ? <LoadingIndicator /> : null}

        {response && response.error ? (
          // The Java decompiler that we use does not support some of the features in recent Java version.
          // Wan't fix it right now so show a explanatory warning message instead of the error.
          response.error.includes('Invalid BootstrapMethods attribute entry') ? (
            <DashboardNotification type="warn">
              Decompilation of class file containing some features in recent Java versions is not fully supported.
            </DashboardNotification>
          ) : (
            <DashboardNotification type="danger">Error: {response.error}</DashboardNotification>
          )
        ) : null}

        {response && response.data ? (
          <Code
            lang={lang}
            line={parseInt(line, 10)}
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
