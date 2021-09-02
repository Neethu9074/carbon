/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ReactElement } from 'react';
import classNames from 'classnames';

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
  alignment,
  subList
}: OverlayOptionProps<VALUE_TYPE>): ReactElement {
  return (
    <Li
      className={classNames(locals.option, className, locals[`align-${alignment ?? 'center'}`])}
      noAlternatingBg
      autoFocus={autoFocus ?? selectedValue === value}
      subList={subList}
      size={size}
      onClick={() => {
        onChange(value);
        close();
      }}
    >
      {children}
    </Li>
  );
}
