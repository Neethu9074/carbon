import React from 'react';

import EntityPageMainNotification from 'in-new-components/EntityPageMainNotification/EntityPageMainNotification';
import ArticleContent from 'in-new-components/ArticleContent';

export default function KubernetesNoDataNotification(props) {
  return (
    <EntityPageMainNotification
      icon="lib_kubernetes"
      title="No Monitoring Data Found"
      renderExplanation={() => <ArticleContent id="kubernetesNoData" />}
      {...props}
    />
  );
}
