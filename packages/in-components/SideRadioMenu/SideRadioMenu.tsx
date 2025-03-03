/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import classNames from 'classnames';
import React from 'react';

import { CarbonRadioButtonGroup, CarbonRadioButton } from '@instana/components';

import locals from 'in-components/SideRadioMenu/SideRadioMenu.mless';

interface Props {
  /** Boolean controlling whether it is rendered in advanced mode or not */
  advancedMode?: boolean;
  /** Carbon radio button items */
  items: { name: string; id: string }[];
  /** This will automatically hide the legend, but make it accessible for screen readers,
   * The default value will be true, if not specified.
   * set it false to show the legend text */
  legendHidden?: boolean;
  /** String to be rendered as a legend */
  legendText?: string;
  /** Function to be executed on clicking one of the radio button */
  onChange: (id: string | number | undefined, ...rest: any[]) => void;
  /** Which radio button value is selected */
  valueSelected: string;
}

export default function SideRadioMenu({
  advancedMode,
  items,
  legendHidden = true,
  legendText,
  onChange,
  valueSelected
}: Props) {
  return (
    <CarbonRadioButtonGroup
      className={classNames(locals.base, {
        [locals.advanced]: advancedMode,
        [locals.legendHidden]: legendText && legendHidden
      })}
      legendText={legendText}
      name="side-radio-menu"
      onChange={onChange}
      orientation="vertical"
      valueSelected={valueSelected}
    >
      {items.map(i => (
        <CarbonRadioButton key={i.id} id={i.id} value={i.id} labelText={i.name} />
      ))}
    </CarbonRadioButtonGroup>
  );
}
