import React from 'react';

import Breadcrumb from 'in-sdk/components/dashboard/breadcrumb/Breadcrumb';
import { getLinkToWebsite } from 'in-websites/navigation/paths';

export default function WebsiteBreadcrumb({ pageId, websiteId }) {
  return (
    <Breadcrumb href$={getLinkToWebsite(websiteId, { pageId })} label="Page" icon="lib_website_page_load">
      {pageId}
    </Breadcrumb>
  );
}
