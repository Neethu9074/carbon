/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

// @ts-expect-error
import { getColorPool } from 'in-services/util/ColorGenerator';
import { lighten } from 'in-services/formatters/color';

import locals from './Tag.mless';

export default function Tag({ tag }: { tag: string }) {
  const color = getColorPool('tags').getColorHex(tag);

  return (
    <div className={locals.automationTag} style={{ background: lighten(color, 0.1), color: color }}>
      {tag}
    </div>
  );
}
