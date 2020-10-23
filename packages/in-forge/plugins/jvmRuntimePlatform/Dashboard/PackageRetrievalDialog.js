import React from 'react';

import LoadingIndicator from 'in-new-components/LoadingIndicators/LoadingIndicator';
import CopyToClipboardButton from 'in-new-components/CopyToClipboardButton';
import DashboardNotification from 'in-components/DashboardNotification';
import { close } from 'in-components/DialogPresenter/store';
import Dialog from 'in-new-components/Dialog/Dialog';
import connectTo from 'in-hoc/connectTo';
import Code from 'in-components/Code';

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
      <Dialog title={`Package: ${packageName}`} onClose={close} renderCustomCloseBehaviour={() => header}>
        {!response ? <LoadingIndicator /> : null}

        {response && response.error ? (
          <DashboardNotification type="danger">Error: {response.error}</DashboardNotification>
        ) : null}

        {response && response.data ? (
          <Code
            lang={lang}
            line="0"
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
