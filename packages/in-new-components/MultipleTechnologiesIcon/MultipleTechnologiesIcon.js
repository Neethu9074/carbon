import React from 'react';

import { getIconSvgPath, getTechnologyLabel } from 'in-sdk/snapshot';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';

import locals from './MultipleTechnologiesIcon.mless';

export default function MultipleTechnologiesIcon({ type, technologies, iconSize, icon }) {
  let iconPath = showTechnologyIcon(type, technologies, icon);

  let technologyLabels = [];
  technologies?.map(technology => technologyLabels.push(getTechnologyLabel(technology)));
  const tooltipLabels = technologyLabels.join(', ');

  if (technologies?.length > 1) {
    return (
      <Tooltip content={tooltipLabels}>
        <div className={locals.wrapper}>
          <SvgIcon className={locals.entityIconSmall} type={icon} iconPath={iconPath} size="xs" />
          <span className={locals.remainderLabel}>+ {technologies.length - 1}</span>
        </div>
      </Tooltip>
    );
  } else {
    return (
      <Tooltip content={tooltipLabels}>
        <div className={locals.wrapper}>
          <SvgIcon className={locals.entityIcon} type={icon} iconPath={iconPath} size={iconSize} />
        </div>
      </Tooltip>
    );
  }
}

const showTechnologyIcon = (type, technologies, icon) => {
  let remainder = technologies ? technologies.length - 1 : -1;
  if (icon && (!technologies || technologies?.length === 0)) {
    return;
  }
  if (remainder < 0) {
    return getIconSvgPath(type);
  }
  return getIconSvgPath(technologies[0]);
};
