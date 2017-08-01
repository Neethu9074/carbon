import React from 'react';

import DownloadView from 'in-components/DownloadButton/components/DownloadView';
import { baseUrl } from 'in-services/config';

export default function TraceDownloadView({ trace }) {
  return <DownloadView data jsonLink={`${baseUrl}/api/traces/${encodeURIComponent(trace.get('traceId'))}?pretty`} />;
}
