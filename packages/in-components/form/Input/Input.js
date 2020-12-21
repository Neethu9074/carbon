import React, { forwardRef } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import SvgIcon from 'in-components/SvgIcon/SvgIcon';

import locals from './Input.mless';

export default forwardRef(FormInput);

function FormInput(
  { iconType, onIconClick, hasError, refSetter, className, hideValidityInformationOnFocus, ...inputProps },
  ref
) {
  let content = (
    <input
      {...inputProps}
      ref={ref || refSetter}
      className={classNames({
        [locals.input]: true,
        [locals.error]: hasError,
        [locals.hideValidityInformationOnFocus]: hideValidityInformationOnFocus,
        [className]: className
      })}
    />
  );

  if (iconType) {
    content = (
      <div className={locals.withIcon}>
        {content} <SvgIcon type={iconType} onClick={onIconClick} className={locals.icon} />
      </div>
    );
  }

  return content;
}

FormInput.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.node,
  className: PropTypes.string,
  hasError: PropTypes.bool,
  hideValidityInformationOnFocus: PropTypes.bool,
  refSetter: PropTypes.any,

  iconType: PropTypes.string,
  onIconClick: PropTypes.func
};
