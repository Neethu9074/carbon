import React from 'react';

import { parseEndpointEntityId } from './entityUtils';
import EntityInformation from './EntityInformation';

export default function EntityWithParentInformation(props) {
  return (
    <div>
      <EntityInformation {...props} />

      {props.entityType === 'Endpoint20' && (
        <EntityInformation
          entityId={parseEndpointEntityId(props.entityId).serviceId}
          entityType="Service20"
          label="Of:"
          timeConfig={props.timeConfig}
        />
      )}
    </div>
  );
}
