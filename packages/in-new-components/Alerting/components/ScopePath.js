/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { forwardRef } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import HorizontalFlexWrapper from 'in-new-components/layout/HorizontalFlexWrapper';
import SvgIcon from 'in-components/SvgIcon';
import { lib } from 'in-themes/theme';

import locals from './IconLabel.mless';

const ScopePath = forwardRef(
  ({ applicationName, serviceName, endpointName, noBottomMargin, color = lib.colors.N900Primary }, ref) => {
    return (
      <HorizontalFlexWrapper
        ref={ref}
        className={classNames({
          [locals.container]: true,
          [locals.noBottomMargin]: noBottomMargin
        })}
        color={color}
      >
        <IconWithLabel iconType="lib_application" label={applicationName} color={color} />
        {serviceName && (
          <>
            <ArrowSeparator color={color} />
            <IconWithLabel iconType="lib_application_service" label={serviceName} color={color} />
          </>
        )}
        {endpointName && (
          <>
            <ArrowSeparator color={color} />
            <IconWithLabel iconType="lib_application_endpoint" label={endpointName} color={color} />
          </>
        )}
      </HorizontalFlexWrapper>
    );
  }
);

function ArrowSeparator({ color }) {
  return <SvgIcon size="s" color={color} type="lib_arrow_expand_right" />;
}

function IconWithLabel({ iconType, label, color }) {
  return (
    <>
      <SvgIcon className={locals.icon} color={color} type={iconType} />
      <span style={{ color }}>{label}</span>
    </>
  );
}

ScopePath.displayName = 'ScopePath';

ScopePath.propTypes = {
  applicationName: PropTypes.string.isRequired,
  serviceName: PropTypes.string,
  endpointName: PropTypes.string,
  color: PropTypes.string,
  noBottomMargin: PropTypes.bool
};

export default ScopePath;
