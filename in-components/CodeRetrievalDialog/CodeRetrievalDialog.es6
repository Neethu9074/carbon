import React from 'react';

import CopyToClipboardButton from 'in-components/CopyToClipboardButton';
import CenterAlignment from 'in-components/layout/CenterAlignment';
import DialogNotification from 'in-components/DialogNotification';
import LoadingIndicator from 'in-components/LoadingIndicator';
import { close } from 'in-components/DialogPresenter/store';
import Dialog from 'in-components/Dialog';
import connectTo from 'in-hoc/connectTo';
import Code from 'in-components/Code';

import './CodeRetrievalDialog.less';

const block = 'in-code-retrieval-dialog';

export default connectTo(
  props => {
    return {
      response: props.agentResponse$
    };
  },
  function CodeDialog({ file, response, lang, line }) {
    let header;
    if (!response) {
      header = `Retrieving file: ${file}`;
    } else if (response.error) {
      header = `Failed to retrieve file: ${file}`;
    } else {
      header = (
        <CenterAlignment>
          <span>File: {file} - Line: {line}</span>

          <CopyToClipboardButton getText={() => response.data} />
        </CenterAlignment>
      );
    }

    return (
      <Dialog header={header} onClose={close} contentClassName={`${block}__content`}>

        {!response ? <LoadingIndicator type="dark" /> : null}

        {response && response.error
          ? <DialogNotification type="danger">
              Error: {response.error}
            </DialogNotification>
          : null}

        {response && response.data
          ? <Code
              lang={lang}
              line={line}
              code={response.data}
              className={`${block}__code`}
              showLineNumbers={lang !== 'java'}
            />
          : null}
      </Dialog>
    );
  }
);
