import React from 'react';

import HorizontalFlexWrapper from 'in-new-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
import CopyToClipboardButton from 'in-new-components/CopyToClipboardButton';
import useDisabledBodyScroll from 'in-hooks/useDisabledBodyScroll';
import KeyValue from 'in-new-components/lists/KeyValue';
import CodeComponent from 'in-components/Code';

import locals from './ApiQueryOverlay.mless';

export default function ApiQueryOverlay({ backendQueryModel }) {
  useDisabledBodyScroll();
  const jsonString = JSON.stringify(backendQueryModel, 0, 2);

  return (
    <div className={locals.wrapper}>
      <HorizontalFlexWrapper className={locals.header}>
        <KeyValue
          className={locals.keyValue}
          inverted
          customValue="API query"
          label="Use this expression to query our API"
          accentuated
        />
        <CopyToClipboardButton kind="action" getText={() => jsonString} />
      </HorizontalFlexWrapper>
      <div className={locals.content}>
        <CodeComponent code={jsonString} lang="json" showLineNumbers={false} />
      </div>
    </div>
  );
}
