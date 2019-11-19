import React from 'react';

import { getEntityLabelLUT, entityTypes } from 'in-analyze/applicationFilter';
import { evaluateClassNames } from 'in-services/util/classnames';
import SvgIcon from 'in-components/SvgIcon';

import locals from './EntityIndicator.mless';

const EntityIndicator = ({ type, groupedByEntity, blueColor }) => {
  return (
    <div
      className={evaluateClassNames({
        [locals.entity]: !blueColor,
        [locals.entityBlue]: blueColor
      })}
    >
      <SvgIcon type={getIconByName(type, groupedByEntity)} />
      <span>{getEntityLabelLUT(groupedByEntity)}</span>
    </div>
  );
};

export default EntityIndicator;

function getIconByName(type, entity = entityTypes.DESTINATION) {
  if (entity === entityTypes.DESTINATION) {
    return 'lib_application_call_destination';
  }
  if (entity === entityTypes.SOURCE) {
    return 'lib_application_call_source';
  }
  if (type.includes('trace')) {
    return 'lib_application_trace';
  }
  if (type.includes('call')) {
    return 'lib_application_call';
  }
  if (type === 'application.name') {
    return 'lib_application';
  }
  if (type === 'service.name') {
    return 'lib_application_service';
  }
  if (type === 'endpoint.name') {
    return 'lib_application_endpoint';
  }

  return 'lib_views_tag';
}
