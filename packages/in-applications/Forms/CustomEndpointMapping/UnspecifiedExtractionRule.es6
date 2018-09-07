import React from 'react';

import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';

import locals from './UnspecifiedExtractionRule.mless';

export default function UnspecifiedExtractionRule() {
  return (
    <div className={locals.unspecifiedExtractionRule}>
      <span className={locals.query}>Unspecified</span>

      <Tooltip themeStyle="light" content="Calls that do match another rule are assigned to this endpoint">
        <SvgIcon className={locals.icon} type="lib_help_error_info_outline" width={24} height={24} />
      </Tooltip>
    </div>
  );
}
