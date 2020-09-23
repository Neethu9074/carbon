import PropTypes from 'prop-types';
import React from 'react';

import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import SvgIcon, { sizes as iconSizes } from 'in-components/SvgIcon/SvgIcon';
import evaluateClassNames from 'in-services/util/classnames';

import locals from './IconButton.mless';

export const kinds = Object.freeze(['primary', 'primaryv2', 'action', 'create', 'danger', 'warning', 'info']);
export const sizes = iconSizes;
const iconDimensions = {
  normal: 'regular',
  compact: 'xs'
};

const IconButton = React.forwardRef(function IconButton(
  { type, size = 'normal', iconSize, kind = 'action', onClick, disabled, leftAligned, rightAligned, refSetter },
  ref
) {
  return (
    <button
      className={evaluateClassNames({
        [locals.iconButton]: true,
        [locals[`iconButton--${kind}`]]: kind,
        [locals[size]]: size,
        [locals.rightAligned]: rightAligned,
        [locals.leftAligned]: leftAligned,
        [locals.disabled]: disabled
      })}
      onClick={e => (disabled ? stopPropagationAndPreventDefault(e) : onClick?.(e))}
      ref={ref || refSetter}
    >
      <SvgIcon
        type={type}
        size={iconSize || iconDimensions[size]}
        className={evaluateClassNames({
          [locals.icon]: true,
          [locals[`icon--${kind}`]]: kind,
          [locals.disabled]: disabled
        })}
        tabIndex={-1}
      />
    </button>
  );
});

export default IconButton;

IconButton.propTypes = {
  disabled: PropTypes.bool,
  kind: PropTypes.oneOf(kinds),
  onClick: PropTypes.func,
  iconSize: PropTypes.oneOf(Object.keys(sizes)),
  size: PropTypes.oneOf(Object.keys(iconDimensions)),
  type: PropTypes.string.isRequired,
  leftAligned: PropTypes.bool,
  rightAligned: PropTypes.bool,
  refSetter: PropTypes.func
};
