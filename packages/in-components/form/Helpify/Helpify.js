import React from 'react';

import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';

import './Helpify.less';

const block = 'in-helpify-wrapper';

export default function Helpify({ children, helpText }) {
  return (
    <div className={block}>
      <div className={`${block}__content`}>{children}</div>
      <div className={`${block}__help-icon`}>
        <Tooltip content={helpText} align="leftMiddle">
          <SvgIcon type="info" size="xs" color="#2D4048" style={{ marginTop: '.25rem' }} />
        </Tooltip>
      </div>
    </div>
  );
}
