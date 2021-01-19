/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import BasicWrapper from 'in-new-components/Errors/BasicWrapper';
import SvgIcon from 'in-components/SvgIcon';

import locals from './NoDataAvailable.mless';

export default function NoDataAvailable({ width, height, title, text, className, icon }) {
  return (
    <BasicWrapper
      className={className}
      width={width}
      height={height}
      title={title}
      text={text || 'No data available'}
      renderIcon={size => (
        <SvgIcon className={locals.icon} type={icon || 'lib_help_error_crossed_circle'} size={size} />
      )}
    />
  );
}
