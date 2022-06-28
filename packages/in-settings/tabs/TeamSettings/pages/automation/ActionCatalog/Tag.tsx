/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

// @ts-expect-error
import { getColorPool } from 'in-services/util/ColorGenerator';

// import './Tag.less';

// const block = 'in-tag';

export default function Tag({ tag }: { tag: string }) {
  const color = getColorPool('tags').getColorHex(tag);

  return <div style={{ borderLeft: `3px solid ${color}` }}>{tag}</div>;
}
