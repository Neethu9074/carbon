/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ReactNode, ReactElement } from 'react';

import { Card } from '@instana/components';

import locals from './DashboardSection.mless';

interface DashboardSectionProps {
  title?: string;
  children: ReactNode;
  button?: ReactElement;
}
export default function DashboardSection({ title, children, button }: DashboardSectionProps): JSX.Element {
  return (
    <div className={locals.dashboardSection}>
      <Card title={title} header={button}>
        {children}
      </Card>
    </div>
  );
}
