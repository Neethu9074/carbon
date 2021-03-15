/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import DownloadView from 'in-components/DownloadButton/components/DownloadView';
import { baseUrl } from 'in-services/config';

export default function AuditLogDownloadView({ offset, query }) {
  return (
    <DownloadView
      data
      jsonLink={`${baseUrl}/api/auditlog`}
      queryParams={{
        offset,
        query,
        pretty: true
      }}
    />
  );
}
