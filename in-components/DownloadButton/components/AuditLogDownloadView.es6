import React from 'react';

import DownloadView from 'in-components/DownloadButton/components/DownloadView';
import {baseUrl} from 'in-services/config';


export default function AuditLogDownloadView({logEntry}) {
  return (
    <DownloadView data
                  jsonLink={`${baseUrl}/api/auditlog/${encodeURIComponent(logEntry.get('id'))}`} />
  );
}
