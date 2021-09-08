/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Ul } from '@instana/components';

import OverlayOption, { OverlayOptionAlignments } from 'in-components/OverlayOption/OverlayOption';
import { OverlayMounterContentProps } from 'in-components/overlays/Overlay/types';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import { onArrowKeyDownFocusSiblings } from 'in-services/util/domFocus';
import { compareIgnoreCase } from 'in-services/util/string';

// @ts-expect-error
import locals from './ComboBoxOverlay.mless';

interface Labeled {
  label: string;
}

export interface ComboBoxOption<OPTION_VALUE_TYPE> extends Labeled {
  value: OPTION_VALUE_TYPE;
  disabled?: boolean;
}

export interface ComboBoxOverlayProps<OPTION_VALUE_TYPE> {
  options: ComboBoxOption<OPTION_VALUE_TYPE>[];
  onChange: (v: any) => void;
  value?: OPTION_VALUE_TYPE;
  disableAutomaticOptionSorting?: boolean;
  listItemClassName?: string;
  listItemAlignment?: OverlayOptionAlignments;
}

type InternalComboBoxOverlayProps<OPTION_VALUE_TYPE> = ComboBoxOverlayProps<OPTION_VALUE_TYPE> &
  OverlayMounterContentProps;

export default function ComboBoxOverlay<OPTION_VALUE_TYPE>({
  options,
  value,
  onChange,
  asyncClose,
  disableAutomaticOptionSorting,
  listItemClassName,
  listItemAlignment
}: InternalComboBoxOverlayProps<OPTION_VALUE_TYPE>) {
  if (!disableAutomaticOptionSorting) {
    options = options.sort(optionLabelComparator);
  }

  return (
    // onKeyDown is part of the ...otherProps rest param which is currently not correctly typed.
    // @ts-expect-error
    <Ul className={locals.list} framed={false} borderRadius="medium" onKeyDown={onKeyDown}>
      {options.map((option, i) => (
        <OverlayOption<OPTION_VALUE_TYPE>
          className={listItemClassName}
          onChange={onChange}
          key={i}
          autoFocus={(value == null && i === 0) || value === option.value}
          // Asynchronously close the overlay. If not for this, a keyboard event can trigger
          // both the closing and opening of the overlay at the same time thereby resulting in a noop.
          close={asyncClose}
          value={option.value}
          alignment={listItemAlignment}
          disabled={option.disabled}
        >
          {option.label}
        </OverlayOption>
      ))}
    </Ul>
  );
}

function optionLabelComparator(a: Labeled, b: Labeled) {
  return compareIgnoreCase(a.label, b.label);
}

function onKeyDown(e: KeyboardEvent): void {
  if (e.defaultPrevented) return;

  // Intercept Enter and Escape to prevent accidental closing of a dialog when used inside a dialog
  if ((e.key === 'Enter', e.key === 'Escape')) return stopPropagationAndPreventDefault(e);

  onArrowKeyDownFocusSiblings(e);
}
