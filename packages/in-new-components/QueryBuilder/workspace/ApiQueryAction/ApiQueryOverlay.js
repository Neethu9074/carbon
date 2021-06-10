/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { KeyValue } from '@instana/components';

import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
import CopyToClipboardButton from 'in-new-components/CopyToClipboardButton';
import useDisabledBodyScroll from 'in-hooks/useDisabledBodyScroll';
import CodeComponent from 'in-components/Code';
import { t } from 'in-i18n';

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
          customValue={t('in-components:queryBuilder.workspaceAPIQuery')}
          label={t('in-components:queryBuilder.workspaceUseThisExpressionToQueryOurAPI')}
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
