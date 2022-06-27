/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import classNames from 'classnames';
import React from 'react';

import locals from './HelpText.mless';

interface Props {
  children: React.ReactNode;
  className?: string;
  large?: boolean;
}

export default function HelpText({ children, className, large = false }: Props) {
  return <p className={classNames(large ? locals.helpLarge : locals.help, className)}>{children}</p>;
}
