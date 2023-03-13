/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import { KeyValue, Toggle } from '@instana/components';

import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
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
  curlUrl
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

  if (groupBy != undefined && groupBy[0] != null) {
    curlUrl = 'https://' + curlUrl + '/api/infrastructure-monitoring/analyze/entity-groups';
  } else {
    curlUrl = 'https://' + curlUrl + '/api/infrastructure-monitoring/analyze/entities';
  }
  const curl =
    'curl -XPOST ' +
    curlUrl +
    " -H 'Content-Type: application/json' -d '" +
    jsonString.replace(/(\r\n|\n|\r|\s)/gm, '') +
    "' -H 'authorization: apiToken xxxxxxxxxxxxx'";

  return (
    <div>
      <HorizontalFlexWrapper className={locals.header}>
        <KeyValue
          inverted
          customValue={t('in-components:queryBuilder.workspaceAPIQuery')}
          label={
            t('in-components:queryBuilder.workspaceUseThisExpressionToQueryOurAPI') +
            ' https://instana.github.io/openapi/#operation/getEntityGroups'
          }
          accentuated
        />
      </HorizontalFlexWrapper>
      <div className={locals.content}>
        <CodeComponent code={curl} lang="java" softWrap="true" />
        <CodeComponent code={jsonString} lang="json" showLineNumbers={false} />
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
