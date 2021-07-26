/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import { KeyValue, Toggle } from '@instana/components';

import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
import CopyToClipboardButton from 'in-components/CopyToClipboardButton';
import useDisabledBodyScroll from 'in-hooks/useDisabledBodyScroll';
import CodeComponent from 'in-components/Code';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './ApiQueryOverlay.mless';

export default function ApiQueryOverlay({ backendQueryModel, backendQueryModelWithFacets }) {
  useDisabledBodyScroll();
  const [includeFacets, setIncludeFacets] = useState(backendQueryModelWithFacets != null);

  const model = includeFacets ? backendQueryModelWithFacets : backendQueryModel;

  const jsonString = JSON.stringify(model, 0, 2);

  return (
    <div>
      <HorizontalFlexWrapper className={locals.header}>
        <KeyValue
          inverted
          customValue={t('in-components:queryBuilder.workspaceAPIQuery')}
          label={t('in-components:queryBuilder.workspaceUseThisExpressionToQueryOurAPI')}
          accentuated
        />
        <CopyToClipboardButton kind="action" getText={() => jsonString} />
      </HorizontalFlexWrapper>
      <div className={locals.content}>
        <CodeComponent code={jsonString} lang="json" showLineNumbers={false} withoutCopyButton />
      </div>
      {backendQueryModelWithFacets != null && (
        <div className={locals.toggleWrapper}>
          <Toggle
            checked={includeFacets}
            onChange={() => setIncludeFacets(!includeFacets)}
            disabled={!backendQueryModelWithFacets}
          />
          <Tooltip content={t('in-components:queryBuilder.workspaceIncludeSidebarFilters')} align={'topMiddle'}>
            <span className={locals.toggleWrapperText}>
              {t('in-components:queryBuilder.workspaceIncludeSidebarFilters')}
            </span>
          </Tooltip>
        </div>
      )}
    </div>
  );
}
