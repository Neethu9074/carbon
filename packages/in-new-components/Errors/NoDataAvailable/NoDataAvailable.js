/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import { SvgIcon } from '@instana/components';

import BasicWrapper from 'in-new-components/Errors/BasicWrapper';
import { t } from 'in-i18n';

import locals from './NoDataAvailable.mless';

export default function NoDataAvailable({ width, height, title, text, className, type = 'lib_bar_chart' }) {
  return (
    <BasicWrapper
      className={className}
      width={width}
      height={height}
      title={title}
      text={text || t('in-new-components:entityVersionList.noDataAvailable')}
      renderIcon={size => <SvgIcon className={locals.icon} type={type} size={size} />}
    />
  );
}

NoDataAvailable.propTypes = {
  className: PropTypes.string,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  text: PropTypes.string,
  title: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /**
   * Icon type. Default is 'lib_bar_chart'
   */
  type: PropTypes.string
};
