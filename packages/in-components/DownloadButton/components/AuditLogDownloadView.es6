import React from 'react';

import DownloadView from 'in-components/DownloadButton/components/DownloadView';
import { baseUrl } from 'in-services/config';

export default function AuditLogDownloadView({ offset, query }) {
  return (
    <DownloadView
      data
      jsonLink={`${baseUrl}/api/auditlog?pretty`}
      queryParams={{
        offset,
        query
      }}
    />
  );
}
