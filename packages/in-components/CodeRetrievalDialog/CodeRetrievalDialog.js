import React from 'react';

import CopyToClipboardButton from 'in-components/CopyToClipboardButton';
import DashboardNotification from 'in-components/DashboardNotification';
import CenterAlignment from 'in-components/layout/CenterAlignment';
import LoadingIndicator from 'in-components/LoadingIndicator';
import { close } from 'in-components/DialogPresenter/store';
import Dialog from 'in-components/Dialog';
import connectTo from 'in-hoc/connectTo';
import Code from 'in-components/Code';

import locals from './CodeRetrievalDialog.mless';

export default connectTo(
  props => {
    return {
      response: props.agentResponse$
    };
  },
  function CodeDialog({ file, response, lang, line }) {
    const hasLine = line != null && !isNaN(parseInt(line, 10));

    let header;
    if (!response) {
      header = `Retrieving file: ${file}`;
    } else if (response.error) {
      header = `Failed to retrieve file: ${file}`;
    } else {
      header = (
        <CenterAlignment>
          <span className={locals.title}>
            File: {file}
            {hasLine ? ` – Line: ${line}` : null}
          </span>

          <CopyToClipboardButton getText={() => response.data} />
        </CenterAlignment>
      );
    }

    return (
      <Dialog header={header} onClose={close} contentClassName={locals.content}>
        {!response ? <LoadingIndicator type="dark" /> : null}

        {response && response.error ? (
          <DashboardNotification type="danger">Error: {response.error}</DashboardNotification>
        ) : null}

        {response && response.data ? (
          <Code
            lang={lang}
            line={parseInt(line, 10)}
            code={response.data}
            className={locals.code}
            showLineNumbers={lang !== 'java'}
            scrollElementClassName={locals.content}
          />
        ) : null}
      </Dialog>
    );
  }
);
