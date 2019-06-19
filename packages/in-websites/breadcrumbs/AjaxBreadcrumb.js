import React from 'react';

import Breadcrumb from 'in-sdk/components/dashboard/breadcrumb/Breadcrumb';

export default function WebsiteBreadcrumb({ xhrId }) {
  return (
    <Breadcrumb label="AJAX Details" icon="lib_website_ajax">
      {xhrId}
    </Breadcrumb>
  );
}
