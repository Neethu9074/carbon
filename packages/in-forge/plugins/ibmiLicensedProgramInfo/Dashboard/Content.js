/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import LicenseInfoTable from 'in-forge/plugins/ibmiLicensedProgramInfo/Dashboard/LicenseInfoTable';

export default function IbmILicensedProgramInfoDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  return <LicenseInfoTable snapshotId={snapshotId} timeConfig={timeConfig} />;
}
