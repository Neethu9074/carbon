/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import { KeyValue, Toggle, Link } from '@instana/components';

import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
import InlineTabNavigation from 'in-components/InlineTabNavigation';
import useDisabledBodyScroll from 'in-hooks/useDisabledBodyScroll';
import CodeComponent from 'in-components/Code';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './ApiQueryOverlay.mless';

export default function ApiQueryOverlay({
  backendQueryModel,
  backendQueryModelWithFacets,
  timeFrame,
  type,
  order,
  pagination,
  groupBy,
  metrics,
  curlUrl,
  docsLink
}) {
  useDisabledBodyScroll();
  const [includeFacets, setIncludeFacets] = useState(backendQueryModelWithFacets != null);

  const model = {
    timeFrame,
    tagFilterExpression: backendQueryModel,
    pagination,
    type,
    metrics,
    order,
    ...(groupBy != undefined && groupBy[0] != null ? { groupBy: groupBy } : {})
  };

  const jsonString = JSON.stringify(model, 0, 2);

  const curl =
    'curl -XPOST ' +
    curlUrl +
    " -H 'Content-Type: application/json'" +
    " -H 'authorization: apiToken xxxxxxxxxxxxx' -d '" +
    jsonString.replace(/(\r\n|\n|\r|\s)/gm, '') +
    "'";

  const tabList = [{ text: 'curl' }, { text: 'JSON tree' }];
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  return (
    <div className={locals.apiQuery}>
      <HorizontalFlexWrapper className={locals.header}>
        <KeyValue
          inverted
          customValue={t('in-components:queryBuilder.workspaceAPIQuery')}
          label={t('in-components:queryBuilder.workspaceUseThisExpressionToQueryOurAPI')}
          accentuated
        />
        {docsLink && (
          <Link href={docsLink} target="_blank">
            {t('in-components:queryBuilder.documentation')}
          </Link>
        )}
      </HorizontalFlexWrapper>
      {docsLink != undefined ? (
        <div className={locals.content}>
          <InlineTabNavigation tabList={tabList} activeTabIndex={activeTabIndex} onTabSelect={setActiveTabIndex} />
          {activeTabIndex == 0 ? (
            <CodeComponent code={curl} lang="java" softWrap="true" />
          ) : (
            <CodeComponent code={jsonString} lang="json" showLineNumbers={false} />
          )}
        </div>
      ) : (
        <div className={locals.content}>
          <CodeComponent code={jsonString} lang="json" showLineNumbers={false} />
        </div>
      )}

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
