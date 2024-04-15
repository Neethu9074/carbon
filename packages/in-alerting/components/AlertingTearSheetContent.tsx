/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { ReactNode, useState } from 'react';
import classNames from 'classnames';

import { Typography } from '@instana/components';

import locals from './AlertingTearSheetContent.mless';

export default function AlertingTearSheetContent({ title, children }: { title: string; children: ReactNode }) {
  const [scrollshadow, setScrollshadow] = useState(false);

  return (
    <div>
      <div
        className={classNames({
          [locals.scrollShadow]: scrollshadow
        })}
      >
        <Typography variant="heading-600">{title}</Typography>
      </div>

      <div className={locals.contentArea} onScroll={e => setScrollshadow(e.currentTarget?.scrollTop > 0)}>
        {children}
      </div>
    </div>
  );
}
