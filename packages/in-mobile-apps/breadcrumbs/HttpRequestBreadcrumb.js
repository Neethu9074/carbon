import React from 'react';

import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';

export default function HttpRequestBreadcrumb({ httpRequestId }) {
  return (
    <Breadcrumb label="HTTP Request Details" icon="lib_website_ajax">
      {httpRequestId}
    </Breadcrumb>
  );
}
