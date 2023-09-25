/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ReactNode } from 'react';

import { IconAction } from 'in-components/KpiCard/KpiCard';
import { Row, Col } from 'in-components/layout/Grid';
import KpiCard from 'in-components/KpiCard';

interface KpiKeyValueProps {
  label: string;
  iconAction?: IconAction;
  children: ReactNode;
}

interface Props {
  children: ReactNode;
}

export function KpiHeading({ children }: Props): JSX.Element {
  return <div>{children}</div>;
}

export function KpiKeyValue({ label, iconAction, children }: KpiKeyValueProps): JSX.Element {
  return (
    <Col xs>
      <KpiCard title={label} iconAction={iconAction}>
        {children}
      </KpiCard>
    </Col>
  );
}

export function KpiSection({ children }: Props): JSX.Element {
  return <Row withBottomMargin>{children}</Row>;
}
