/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { forwardRef } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { SvgIcon } from '@instana/components';

import { stopPropagationAndPreventDefault } from 'in-services/util/function';

import locals from './FloatingActionButton.mless';

/* same scheme as used for IconButtons */
export const kinds = ['primaryv2', 'action'];

function FloatingActionButton({ children, iconType, onClick, withBoxShadow, kind = 'primaryv2' }, ref) {
  return (
    <button
      ref={ref}
      className={classNames({
        [locals.button]: true,
        [locals.withShadow]: withBoxShadow,
        [locals[kind]]: true,
        [locals.hasIcon]: !!iconType
      })}
      onClick={e => (onClick ? onClick(e) : stopPropagationAndPreventDefault(e))}
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

export default forwardRef(FloatingActionButton);

FloatingActionButton.propTypes = {
  children: PropTypes.node.isRequired,
  iconType: PropTypes.string,
  onClick: PropTypes.func,
  kind: PropTypes.oneOf(kinds),
  withBoxShadow: PropTypes.bool
};
