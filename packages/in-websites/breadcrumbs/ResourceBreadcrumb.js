import React from 'react';

import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';

export default function WebsiteBreadcrumb({ resourceId }) {
  return (
    <Breadcrumb label="Resource Details" icon="lib_website_resource">
      {resourceId}
    </Breadcrumb>
  );
}
