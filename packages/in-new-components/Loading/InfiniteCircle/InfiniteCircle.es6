import React from 'react';

import BasicWrapper from 'in-new-components/Errors/BasicWrapper';
import SvgIcon from 'in-components/SvgIcon';

import locals from './InfiniteCircle.mless';

export default function InfiniteCircle({ width, height, customText }) {
  return (
    <BasicWrapper
      width={width}
      height={height}
      text={customText || 'Loading data'}
      renderIcon={size => <SvgIcon className={locals.icon} type="lib_actions_loading" height={size} spinning />}
    />
  );
}
