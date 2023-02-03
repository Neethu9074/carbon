/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ReactNode } from 'react';
import classNames from 'classnames';

import { Li, SvgIcon } from '@instana/components';

import locals from './Section.mless';

interface SectionProps {
  // Title is desired to be optional to implement some common UX patterns.
  title: ReactNode;
  children: ReactNode;
  useAlternateBg?: boolean;
  titleWidth?: string;
  actions?: ReactNode;
  icon?: string;
  iconColor?: string;
  titleHtmlFor?: string;
  hasError?: boolean;
}

export default function Section({
  title,
  titleHtmlFor,
  hasError,
  icon,
  children,
  actions,
  iconColor,
  useAlternateBg,
  titleWidth = '11rem'
}: SectionProps) {
  return (
    <Li component="div" noAlternatingBg forceAlternateBg={useAlternateBg}>
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
          {icon && <SvgIcon type={icon} color={iconColor} />}
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
    </Li>
  );
}
