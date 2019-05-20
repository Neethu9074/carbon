import React from 'react';

import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';

import './TooltipIcon.less';

const block = 'in-dynamic-rule-tooltip-icon';

export default function TooltipIcon({ tooltip }) {
  return (
    <Tooltip content={tooltip}>
      <SvgIcon className={block} type="info" color="#6B8088" width={16} />
    </Tooltip>
  );
}
