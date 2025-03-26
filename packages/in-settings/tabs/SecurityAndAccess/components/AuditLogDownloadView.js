/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import DownloadView from 'in-components/DownloadButton/components/DownloadView';
import { formatPathWithTU } from 'in-services/formatters/url';
import { baseUrl } from 'in-services/config';

export default function AuditLogDownloadView({ offset, query, pageSize, endpoint, download }) {
  const linkToDownload = baseUrl + formatPathWithTU(endpoint ?? '');
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
      download={download}
    />
  );
}
