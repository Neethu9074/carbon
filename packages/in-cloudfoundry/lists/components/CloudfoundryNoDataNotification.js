import React from 'react';

import EntityPageMainNotification from 'in-new-components/EntityPageMainNotification/EntityPageMainNotification';
import ArticleContent from 'in-new-components/ArticleContent';

export default function CloudfoundryNoDataNotification(props) {
  return (
    <EntityPageMainNotification
      icon="lib_cloudfoundry"
      title="No Monitoring Data Found"
      renderExplanation={() => <ArticleContent id="cloudfoundryNoData" />}
      {...props}
    />
  );
}
