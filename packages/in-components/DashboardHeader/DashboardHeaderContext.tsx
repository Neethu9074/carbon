/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Link } from '@instana/components';

import locals from 'in-components/DashboardHeader/DashboardHeaderContext.mless';

export default function DashboardHeaderContext({ href, onClick, label }: DashboardHeaderContextTypes) {
  return (
    <Link className={locals.context} href={href} onClick={onClick}>
      {label}
    </Link>
  );
}

interface DashboardHeaderContextTypes {
  href: string;
  onClick?: ((e: EventPlaceholder) => void) | undefined;
  label: string;
}
type EventPlaceholder = {
  stopPropagation: () => void;
  preventDefault: () => void;
};
