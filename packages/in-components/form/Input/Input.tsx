/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { forwardRef } from 'react';
import classNames from 'classnames';

import { EventPlaceholder } from '@instana/components/types/components/SvgIcon/types';
import { SvgIcon } from '@instana/components';

import locals from './Input.mless';

export default forwardRef<HTMLInputElement, FieldProps>(function FormInput(props: FieldProps, ref) {
  const {
    iconType,
    onIconClick,
    hasError,
    refSetter,
    className,
    hideValidityInformationOnFocus,
    ...inputProps
  } = props;

  let content = (
    <input
      {...inputProps}
      ref={ref || refSetter}
      className={classNames(locals.input, className, {
        [locals.error]: hasError,
        [locals.hideValidityInformationOnFocus]: hideValidityInformationOnFocus
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
});

type FieldProps = {
  className?: string | undefined;
  hasError?: boolean | undefined;
  hideValidityInformationOnFocus?: boolean | undefined;
  refSetter?: React.MutableRefObject<HTMLInputElement> | undefined;
  /**
   * From SvgIcon:
   * Used to select the icon that this component should show.
   *
   * Refer to the documentation to learn about all supported icon
   * types.
   *
   * Alternatively, leverage the `getSvgIconNames` API.
   */
  iconType?: string | undefined;
  onIconClick?: (e: EventPlaceholder) => void | undefined;
} & React.InputHTMLAttributes<HTMLInputElement>;
