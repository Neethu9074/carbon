import { assign } from 'lodash';
import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import SvgIcon from 'in-components/SvgIcon/SvgIcon';

import locals from './Input.mless';

export default function FormInput(props) {
  const { iconType, onIconClick } = props;
  const inputProps = assign({}, props);
  inputProps.className = evaluateClassNames({
    [locals.input]: true,
    [locals.error]: props.hasError,
    [locals.hideValidityInformationOnFocus]: props.hideValidityInformationOnFocus,
    [props.className]: props.className
  });
  delete inputProps.hasError;
  delete inputProps.refSetter;
  delete inputProps.iconType;
  delete inputProps.onIconClick;

  const inputElement = <input {...inputProps} ref={props.refSetter} />;

  return iconType ? (
    <div className={locals.withIcon}>
      {inputElement} <SvgIcon type={iconType} onClick={onIconClick} />
    </div>
  ) : (
    inputElement
  );
}
