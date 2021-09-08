/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ReactElement } from 'react';
import classNames from 'classnames';
import { noop } from 'lodash';

import { Li, ListSizes } from '@instana/components';

// @ts-expect-error
import locals from './OverlayOption.mless';

// https://steveholgado.com/typescript-types-from-arrays/
export const alignments = ['center', 'left'] as const;
export type OverlayOptionAlignments = typeof alignments[number];

interface OverlayOptionProps<VALUE_TYPE> {
  alignment?: OverlayOptionAlignments;
  autoFocus?: boolean;
  className?: string;
  selectedValue?: VALUE_TYPE;
  size?: keyof typeof ListSizes;

  children: React.ReactNode;
  close: (e?: any) => void;
  onChange: (value: VALUE_TYPE) => void;
  subList?: React.ReactNode;
  value: VALUE_TYPE;
  disabled?: boolean;
}

export default function OverlayOption<VALUE_TYPE>({
  autoFocus,
  className,
  selectedValue,
  value,
  onChange,
  close,
  size,
  children,
  alignment = alignments[0],
  subList,
  disabled
}: OverlayOptionProps<VALUE_TYPE>): ReactElement {
  return (
    <Li
      className={classNames(locals.option, className, locals[`align-${alignment}`], disabled ? locals.disabled : '')}
      noAlternatingBg
      autoFocus={autoFocus ?? selectedValue === value}
      subList={subList}
      size={size}
      onClick={
        disabled
          ? noop
          : () => {
              onChange(value);
              close();
            }
      }
      aria-disabled={disabled ? 'true' : undefined}
    >
      {children}
    </Li>
  );
}
