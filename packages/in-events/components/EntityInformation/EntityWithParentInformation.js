/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { fromJS } from 'immutable';
import React from 'react';

import { physicalDashboardPath } from 'in-stores/navigation/paths/mainPaths';

import { isEndpointEntity } from 'in-services/entityUtils';
import EntityInformation from './EntityInformation';

export default function EntityWithParentInformation(props) {
  const { entityType, entityId, metadata, timeConfig, linkTimeConfig } = props;
  return (
    <div>
      <EntityInformation {...props} pathname={physicalDashboardPath} />

      {isEndpointEntity(entityType) && metadata && (
        <EntityInformation
          entityId={metadata.get('app20ServiceId')}
          entityType="Service20"
          label="Of Service:"
          pathname={physicalDashboardPath}
          metadata={fromJS({
            entityLabel: metadata.get('app20EndpointServiceLabel'),
            app20EndpointId: entityId
          })}
          timeConfig={timeConfig}
          linkTimeConfig={linkTimeConfig}
        />
      )}
    </div>
  );
}
