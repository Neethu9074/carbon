import React from 'react';

import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import Button from 'in-components/Button';

import './Misc.less';

const block = 'in-dev-panel-misc';

export default function Misc() {
  return (
    <div className={block}>
      <Section title="Messages">
        <Button
          onClick={() =>
            addMessage(
              {
                type: 'info',
                title: 'Test Info Title',
                content: 'This is the content.'
              },
              'test_info_msg'
            )}
        >
          Create Info
        </Button>
        &nbsp;
        <Button
          onClick={() =>
            addMessage(
              {
                type: 'warning',
                title: 'Test Warning Title',
                content: 'This is the content.'
              },
              'test_warning_msg'
            )}
        >
          Create Warning
        </Button>
        &nbsp;
        <Button
          onClick={() =>
            addMessage(
              {
                type: 'danger',
                title: 'Test Error Title',
                content: 'This is the content.'
              },
              'test_error_msg'
            )}
        >
          Create Error
        </Button>
      </Section>
      <Section title="Furter stuff" />
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className={`${block}__section`}>
      <h2 className={`${block}__title`}>
        {title}
      </h2>

      {children}
    </div>
  );
}
