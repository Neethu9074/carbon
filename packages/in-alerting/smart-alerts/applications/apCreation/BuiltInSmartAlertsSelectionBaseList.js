/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import PropTypes from 'prop-types';
import React from 'react';

import { ColumnizedContent, Li, Ul } from '@instana/components';

export default function BuiltInSmartAlertsSelectionBaseList({
  alertConfigs = [],
  columnDefinitions = [],
  ...useCaseSpecificProps
}) {
  return (
    <Ul framed>
      {alertConfigs.map((config, i) => (
        <Li key={config.id}>
          <ColumnizedContent
            {...useCaseSpecificProps}
            columnDefinitions={columnDefinitions}
            config={config}
            index={i}
          />
        </Li>
      ))}
    </Ul>
  );
}

BuiltInSmartAlertsSelectionBaseList.propTypes = {
  alertConfigs: PropTypes.array,
  columnDefinitions: PropTypes.array
};
