import React from 'react';

import BasicWrapper from 'in-new-components/Errors/BasicWrapper';
import SvgIcon from 'in-components/SvgIcon';

import locals from './NoDataAvailable.mless';

export default function NoDataAvailable({ width, height, text }) {
  return (
    <BasicWrapper
      width={width}
      height={height}
      text={text || 'No data available'}
      icon="lib_help_error_crossed_circle"
      renderIcon={size => <SvgIcon className={locals.icon} type="lib_help_error_crossed_circle" height={size} />}
    />
  );
}
