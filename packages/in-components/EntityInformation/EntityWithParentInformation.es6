import { just } from 'reactive-observables';
import React from 'react';

import { getEntityOfType, isLoading, hasErrors } from './entityUtils';
import EntityInformation from './EntityInformation';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => {
    if (props.entityType === 'Endpoint20') {
      return getEntityOfType(props.entityId, props.entityType, props.timeConfig);
    }
    return {
      entity: just(null)
    };
  },
  function EntityWithParentInformation(props) {
    const { entity, entityType, timeConfig } = props;

    if (!entity || isLoading(entity) || hasErrors(entity)) {
      return <EntityInformation {...props} />;
    }

    return (
      <div>
        <EntityInformation {...props} />

        {entityType === 'Endpoint20' &&
          entity && (
            <EntityInformation
              entityId={entity.data.serviceId}
              entityType="Service20"
              label="Of Service:"
              timeConfig={timeConfig}
            />
          )}
      </div>
    );
  }
);
