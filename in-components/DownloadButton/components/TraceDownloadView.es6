import React from 'react';

import DownloadView from 'in-components/DownloadButton/components/DownloadView';
import {instanaBaseUrl$} from 'in-stores/navigation';
import connectTo from 'in-hoc/connectTo';


export default connectTo(props => {
  return {
    href: instanaBaseUrl$.map(url => `${url}api/trace/${props.trace.get('traceId')}`)
  };
},
function TraceDownloadView({href}) {
  if (!href) {
    return null;
  }

  return (
    <DownloadView data
                  jsonLink={href} />
  );
});
