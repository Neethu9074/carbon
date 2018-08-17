import React, { Fragment } from 'react';

import SvgIcon from 'in-components/SvgIcon';

import locals from './NoDataAvailable.mless';

export default function NoDataAvailable({ width, height, size = 'default' }) {
  return (
    <div
      style={{
        width,
        height
      }}
      className={locals.wrapper}
    >
      {size === 'small' && <SvgIcon className={locals.icon} type="lib_help_error_crossed_circle" height={24} />}
      {size === 'default' && (
        <Fragment>
          <SvgIcon className={locals.icon} type="lib_help_error_crossed_circle" height={48} />
          <span className={locals.text}>No data available</span>
        </Fragment>
      )}
    </div>
  );
}
