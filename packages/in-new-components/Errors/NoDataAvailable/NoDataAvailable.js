/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import PropTypes from 'prop-types';
import { t } from 'in-i18n';
import React from 'react';

import BasicWrapper from 'in-new-components/Errors/BasicWrapper';
import SvgIcon from 'in-components/SvgIcon';

import locals from './NoDataAvailable.mless';

export default function NoDataAvailable({ width, height, title, text, className }) {
  return (
    <BasicWrapper
      className={className}
      width={width}
      height={height}
      title={title}
      text={text || t('in-new-components:entityVersionList.noDataAvailable')}
      renderIcon={size => <SvgIcon className={locals.icon} type={'lib_bar_chart'} size={size} />}
    />
  );
}

NoDataAvailable.propTypes = {
  className: PropTypes.string,
  height: PropTypes.oneOf([PropTypes.string, PropTypes.number]),
  text: PropTypes.string,
  title: PropTypes.string,
  width: PropTypes.oneOf([PropTypes.string, PropTypes.number])
};
