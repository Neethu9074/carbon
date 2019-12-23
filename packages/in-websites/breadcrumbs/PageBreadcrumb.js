import React from 'react';

import { getLinkToWebsite } from 'in-websites/navigation/paths';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';

export default function WebsiteBreadcrumb({ pageId, websiteId }) {
  return (
    <Breadcrumb href$={getLinkToWebsite(websiteId, { pageId })} label="Page" icon="lib_document">
      {pageId}
    </Breadcrumb>
  );
}
