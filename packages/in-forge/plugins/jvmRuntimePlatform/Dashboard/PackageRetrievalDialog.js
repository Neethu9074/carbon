import React from 'react';

import CopyToClipboardButton from 'in-components/CopyToClipboardButton';
import DashboardNotification from 'in-components/DashboardNotification';
import LoadingIndicator from 'in-components/LoadingIndicator';
import { close } from 'in-components/DialogPresenter/store';
import Dialog from 'in-components/Dialog';
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
    if (!response) {
      header = `Retrieving package: ${packageName}`;
    } else if (response.error) {
      header = `Failed to retrieve package: ${packageName}`;
    } else {
      header = (
        <div>
          <span className={locals.title}>Package: {packageName}</span>

          <CopyToClipboardButton getText={() => response.data} />
        </div>
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
