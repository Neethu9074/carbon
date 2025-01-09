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
  onChange: (id: string | number | undefined, ...rest: any[]) => void;
  valueSelected: string;
  items: { name: string; id: string }[];
  advancedMode?: boolean;
}

export default function AlertTypeRadio({ onChange, valueSelected, items, advancedMode }: Props) {
  return (
    <CarbonRadioButtonGroup
      className={classNames(locals.base, {
        [locals.advanced]: advancedMode
      })}
      onChange={onChange}
      name="side-radio-menu"
      valueSelected={valueSelected}
      orientation="vertical"
    >
      {items.map(i => (
        <CarbonRadioButton key={i.id} id={i.id} value={i.id} labelText={i.name} />
      ))}
    </CarbonRadioButtonGroup>
  );
}
