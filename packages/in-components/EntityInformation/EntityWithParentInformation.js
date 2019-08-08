import { fromJS } from 'immutable';
import React from 'react';

import EntityInformation from './EntityInformation';
import { isEndpointEntity } from 'in-services/entityUtils';

export default function EntityWithParentInformation(props) {
  const { entityType, entityId, metadata, timeConfig } = props;
  return (
    <div>
      <EntityInformation {...props} />

      {isEndpointEntity(entityType) &&
        metadata && (
          <EntityInformation
            entityId={metadata.get('app20ServiceId')}
            entityType="Service20"
            label="Of Service:"
            metadata={fromJS({
              entityLabel: metadata.get('app20EndpointServiceLabel'),
              app20EndpointId: entityId
            })}
            timeConfig={timeConfig}
          />
        )}
    </div>
  );
}
