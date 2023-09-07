/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Link } from '@instana/components';

import { useVspehereEntityLink, VsphereEntities } from 'in-vsphere/navigation/paths';

import locals from './SnapshotLink.mless';

type Props = {
  vsphereEntityType: keyof typeof VsphereEntities;
  snapshotId: string;
  children: JSX.Element;
  parameters: unknown;
};

export default function VsphereSnapshotLink({ vsphereEntityType, snapshotId, children, parameters }: Props) {
  const getVsphereViewEntityDashboard = useVspehereEntityLink(vsphereEntityType, parameters as any);

  return (
    <Link href={getVsphereViewEntityDashboard(snapshotId)} className={locals.inSnapshotLink}>
      {children}
    </Link>
  );
}
