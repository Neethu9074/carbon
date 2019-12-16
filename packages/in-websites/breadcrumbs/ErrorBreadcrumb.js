import React from 'react';

import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';

export default function WebsiteBreadcrumb({ message }) {
  return (
    <Breadcrumb label="JS Error Details" icon="lib_website_error">
      {message}
    </Breadcrumb>
  );
}
