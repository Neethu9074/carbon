/*
 * (c) Copyright IBM Corp. 2025
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { CarbonMenuItem } from '@instana/components';

import { getEmptyTagFilterExpression } from 'in-components/QueryBuilder/tagFilter/emptyTagFilterExpression';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { getValueMatchTagFilter, ReducedTagFilterWithDefaults } from 'in-logging/queryBuilder';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { useLinkToLogs } from 'in-logging/navigation/paths';
import { TagFilterExpression, TimeConfig } from 'in-types';
import { useHasLogs } from 'in-logging/hooks';
import { t } from 'in-i18n';

import locals from 'in-integrations/logging/analyzeLogs/analyzeLogsButton.mless';

interface AnalyzeLogsButtonProps {
  timeConfig: TimeConfig;
  tagFilter?: ReducedTagFilterWithDefaults;
}

export default function AnalyzeLogsButton({ timeConfig, tagFilter }: AnalyzeLogsButtonProps) {
  const { goToPath } = useNavigation();

  let tagFilterExpression: TagFilterExpression = getEmptyTagFilterExpression();

  if (tagFilter) {
    tagFilterExpression =
      tagFilter && (toBackendQueryModel([getValueMatchTagFilter(tagFilter)]) as TagFilterExpression);
  }

  const hasLogs = useHasLogs({ tagFilterExpression, timeConfig });

  const hostRef = useLinkToLogs({ tagFilterExpression });

  return (
    <>
      {hasLogs && tagFilter && (
        <CarbonMenuItem label={t('in-integrations:logging.analyzeLogs')} onClick={() => goToPath(hostRef.slice(2))} />
      )}
      <li className={locals.integrations}>{t('in-integrations:logging.integrations')}</li>
    </>
  );
}
