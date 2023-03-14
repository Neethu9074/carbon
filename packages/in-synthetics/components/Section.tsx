/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import classNames from 'classnames';
import React from 'react';

import locals from './Section.mless';

export interface SectionProps {
  children: React.ReactNode | React.ReactNode[];
  headingText?: string;
}

export default function Section({ children, headingText }: SectionProps) {
  return (
    <section className={locals.container}>
      <h2 className={locals.heading}>{headingText}</h2>
      {children}
    </section>
  );
}

interface SubTitleProps {
  children: React.ReactNode | React.ReactNode[];
  isUploadScriptSubTitle?: boolean;
}

export function SubTitle({ children, isUploadScriptSubTitle }: SubTitleProps) {
  return (
    <h4 className={classNames(locals.subTitle, { [locals.scriptSubTitle]: isUploadScriptSubTitle })}>{children}</h4>
  );
}

export function ActionTitle({ children, isUploadScriptSubTitle }: SubTitleProps) {
  return (
    <h4 className={classNames(locals.actionSubTitle, { [locals.scriptSubTitle]: isUploadScriptSubTitle })}>
      {children}
    </h4>
  );
}

export function Description({ children, isUploadScriptSubTitle }: SubTitleProps) {
  return (
    <p className={classNames(locals.scriptSubTitle, { [locals.scriptSubTitle]: isUploadScriptSubTitle })}>{children}</p>
  );
}
