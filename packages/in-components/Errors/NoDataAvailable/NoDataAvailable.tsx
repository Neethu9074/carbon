/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { SvgIcon } from '@instana/components';

import BasicWrapper from 'in-components/Errors/BasicWrapper';
import { t } from 'in-i18n';

// @ts-expect-error
import locals from './NoDataAvailable.mless';

export interface NoDataAvailableProps {
  width?: string | number;
  height?: string | number;
  title?: string;
  text?: string;
  className?: string;
  type?: string;
}

export default function NoDataAvailable({
  width,
  height,
  title,
  text,
  className,
  type = 'lib_bar_chart'
}: NoDataAvailableProps) {
  return (
    <BasicWrapper
      className={className}
      width={width}
      height={height}
      title={title}
      text={text || t('in-components:entityVersionList.noDataAvailable')}
      renderIcon={size => <SvgIcon className={locals.icon} type={type} size={size} />}
    />
  );
}
