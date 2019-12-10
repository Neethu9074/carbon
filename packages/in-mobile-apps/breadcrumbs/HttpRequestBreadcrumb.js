import React from 'react';

import Breadcrumb from 'in-sdk/components/dashboard/breadcrumb/Breadcrumb';

export default function HttpRequestBreadcrumb({ httpRequestId }) {
  return (
    <Breadcrumb label="HTTP Request Details" icon="lib_website_ajax">
      {httpRequestId}
    </Breadcrumb>
  );
}
