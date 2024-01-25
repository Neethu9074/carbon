/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { PropsWithChildren } from 'react';
import classNames from 'classnames';

import DashboardHeaderModule from 'in-components/DashboardHeader/DashboardHeaderModule';

import locals from './AdditionalDashboardHeader.mless';

interface AdditionalDashboardHeaderProps {
  className?: string;
}

export default function AdditionalDashboardHeader({
  className,
  children
}: PropsWithChildren<AdditionalDashboardHeaderProps>) {
  return <DashboardHeaderModule className={classNames(locals.wrapper, className)}>{children}</DashboardHeaderModule>;
}
