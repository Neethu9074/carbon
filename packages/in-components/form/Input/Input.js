import { assign } from 'lodash';
import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import SvgIcon from 'in-components/SvgIcon/SvgIcon';

import './Input.less';

const block = 'in-input';

export default function FormInput(props) {
  const { iconType, onIconClick } = props;
  const inputProps = assign({}, props);
  inputProps.className = evaluateClassNames({
    [block]: true,
    [`${block}--has-error`]: props.hasError,
    [props.className]: props.className
  });
  delete inputProps.hasError;
  delete inputProps.refSetter;
  delete inputProps.iconType;
  delete inputProps.onIconClick;

  const inputElement = <input {...inputProps} ref={props.refSetter} />;

  return iconType ? (
    <div className={`${block}--with-icon`}>
      {inputElement} <SvgIcon type={iconType} onClick={onIconClick} />
    </div>
  ) : (
    inputElement
  );
}
