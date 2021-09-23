/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import PropTypes from 'prop-types';
import React from 'react';

import { ColumnizedContent, Li, Ul } from '@instana/components';

import LoadingList from 'in-components/lists/List/sharedComponents/LoadingList';
import { isLoading } from 'in-services/util/result';

export default function BuiltInSmartAlertsSelectionBaseList({
  alertConfigsResult,
  columnDefinitions = [],
  ...useCaseSpecificProps
}) {
  const loading = isLoading(alertConfigsResult);
  const alertConfigs = alertConfigsResult.data;

  return (
    <Ul framed>
      {!loading &&
        alertConfigs.map((config, i) => (
          <Li key={config.id}>
            <ColumnizedContent
              {...useCaseSpecificProps}
              columnDefinitions={columnDefinitions}
              config={config}
              index={i}
            />
          </Li>
        ))}
      {loading && <LoadingList numSkeletonRows="3" />}
    </Ul>
  );
}

BuiltInSmartAlertsSelectionBaseList.propTypes = {
  alertConfigsResult: PropTypes.object,
  columnDefinitions: PropTypes.array
};
