import { fromJS } from 'immutable';
import React from 'react';

import EntityInformation from './EntityInformation';
import { is20Endpoint } from 'in-services/entityUtils';

export default function EntityWithParentInformation(props) {
  const { entityType, metadata, timeConfig } = props;
  return (
    <div>
      <EntityInformation {...props} />

      {is20Endpoint(entityType) &&
        metadata && (
          <EntityInformation
            entityId={metadata.get('app20ServiceId')}
            entityType="Service20"
            label="Of Service:"
            metadata={fromJS({
              entityLabel: metadata.get('app20EndpointServiceLabel')
            })}
            timeConfig={timeConfig}
          />
        )}
    </div>
  );
}
