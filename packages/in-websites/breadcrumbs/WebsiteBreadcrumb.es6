import React from 'react';

import Breadcrumb from 'in-sdk/components/dashboard/breadcrumb/Breadcrumb';
import getWebsite from 'in-subscription/websiteMonitoring/getWebsite';
import { getLinkToWebsite } from 'in-websites/navigation/paths';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  ({ websiteId, timeConfig }) => ({
    website: getWebsite({
      id: websiteId,
      timeConfig
    })
  }),
  function WebsiteBreadcrumb({ website, websiteId }) {
    return (
      <Breadcrumb href$={getLinkToWebsite(websiteId, { pageId: null })} label="Website">
        {website.data && website.data.label}
      </Breadcrumb>
    );
  }
);
