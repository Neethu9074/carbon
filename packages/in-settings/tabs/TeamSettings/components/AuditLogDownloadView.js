/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import DownloadView from 'in-components/DownloadButton/components/DownloadView';
import { baseUrl } from 'in-services/config';

export default function AuditLogDownloadView({ offset, query, pageSize, endpoint }) {
  const linkToDownload = baseUrl + endpoint;
  return (
    <DownloadView
      data
      jsonLink={linkToDownload}
      queryParams={{
        offset,
        query,
        pageSize,
        pretty: true
      }}
    />
  );
}
