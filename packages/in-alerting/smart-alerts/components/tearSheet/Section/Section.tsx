/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { ReactNode } from 'react';
import classNames from 'classnames';

import locals from './Section.mless';

interface SectionProps {
  // Title is desired to be optional to implement some common UX patterns.
  title: ReactNode;
  children: ReactNode;
  titleWidth?: string;
  actions?: ReactNode;
  titleHtmlFor?: string;
  hasError?: boolean;
}

export default function Section({
  title,
  titleHtmlFor,
  hasError,
  children,
  actions,
  titleWidth = '11rem'
}: SectionProps) {
  return (
    <div>
      <div className={locals.section}>
        <label
          htmlFor={titleHtmlFor}
          className={classNames(locals.title, {
            [locals.hasError]: hasError
          })}
          style={{
            ['--titleWidth' as any]: titleWidth
          }}
        >
          <span className={locals.titleText}>{title}</span>
        </label>

        <div
          className={locals.content}
          style={{
            ['--titleWidth' as any]: titleWidth
          }}
        >
          {children}
        </div>

        {actions && <div className={locals.actions}>{actions}</div>}
      </div>
    </div>
  );
}
