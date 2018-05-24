import React from 'react';

import {
  getIconSvgPath as getIconSvgPathForType,
  getSingular as getSingularForType
} from 'in-applications/typeGroupRegistry';
import { getIconSvgPath as getIconSvgPathForPlugin } from 'in-sdk/snapshot';
import { getSingular as getSingularForPlugin } from 'in-sdk/pluginName';
import unknownIconSvgPath from 'in-sdk/unknownIconPath';
import Tooltip from 'in-components/Tooltip';

import locals from './TechnologyIndicator.mless';

export default function TechnologyIndicator({ pluginOrGroupType, showTechnologyLabel = true }) {
  let path = getIconSvgPathForPlugin(pluginOrGroupType);
  if (path === unknownIconSvgPath || !path) {
    path = getIconSvgPathForType(pluginOrGroupType);
  }

  let label = getSingularForPlugin(pluginOrGroupType);
  if (!label) {
    label = getSingularForType(pluginOrGroupType);
  }

  if (!label) {
    return null;
  }

  let content = (
    <div className={locals.wrapper}>
      {path && (
        <svg className={locals.icon} width={16} height={16} viewBox={`0 0 128 128`}>
          {/* Ensure that the whole width/height is clickable in Safari */}
          <rect width="100%" height="100%" fill="rgba(0, 0, 0, 0)" />
          <path d={path} />
        </svg>
      )}
      {showTechnologyLabel && <span className={locals.label}>{label}</span>}
    </div>
  );

  if (showTechnologyLabel) {
    return content;
  }

  return <Tooltip content={label}>{content}</Tooltip>;
}
