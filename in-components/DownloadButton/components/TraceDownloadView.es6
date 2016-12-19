import React from 'react';

import DownloadView from 'in-components/DownloadButton/components/DownloadView';


export default function TraceDownloadView({trace}) {
  return (
    <DownloadView data={trace}
                  fileName={`trace-${trace.get('traceId')}`}

                  getJsonData={() => getJsonData(trace)} />
  );
}

function getJsonData(trace) {
  return JSON.stringify(trace, null, 4);
}
