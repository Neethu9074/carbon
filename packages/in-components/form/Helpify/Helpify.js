/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

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
          <SvgIcon type="lib_help_error_info_outline" color="#2D4048" style={{ marginTop: '.25rem' }} />
        </Tooltip>
      </div>
    </div>
  );
}
