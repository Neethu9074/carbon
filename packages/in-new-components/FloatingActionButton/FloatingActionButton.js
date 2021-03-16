/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import SvgIcon from 'in-components/SvgIcon/SvgIcon';

import locals from './FloatingActionButton.mless';

/* same scheme as used for IconButtons */
export const kinds = ['primaryv2', 'action'];

export default function FloatingActionButton({
  children,
  iconType,
  onClick,
  onBlur,
  withBoxShadow,
  kind = 'primaryv2'
}) {
  return (
    <button
      className={classNames({
        [locals.button]: true,
        [locals.withShadow]: withBoxShadow,
        [locals[kind]]: true,
        [locals.hasIcon]: !!iconType
      })}
      onBlur={onBlur}
      onClick={e => (onClick ? onClick() : stopPropagationAndPreventDefault(e))}
    >
      <div className={locals.inner}>
        {iconType && (
          <SvgIcon
            className={classNames({
              [locals.iconHasMargin]: !!children,
              [locals.icon]: !!iconType
            })}
            type={iconType}
          />
        )}
        <div className={locals.label}>{children}</div>
      </div>
    </button>
  );
}

FloatingActionButton.propTypes = {
  children: PropTypes.node.isRequired,
  iconType: PropTypes.string,
  onClick: PropTypes.func,
  onBlur: PropTypes.func,
  kind: PropTypes.oneOf(kinds),
  withBoxShadow: PropTypes.bool
};
