import React from 'react';

import SparkChartsSection from 'in-sdk/components/sidebar/SparkChartsSection';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import { number, millis } from 'in-services/formatters/number';
import Separator from 'in-sdk/components/sidebar/Separator';
import { emptyList } from 'in-services/fixedImmutables';

export default function PageAssetList({ snapshot }) {
  const endpoints = snapshot.getIn(['data', 'service_endpoints'], emptyList).toArray().sort();
  if (endpoints.length === 0) {
    return null;
  }

  return (
    <div>
      {endpoints.map(endpoint => (
        <div key={endpoint}>
          <Separator />

          <Collapsible>
            <Collapsible.Header>
              {endpoint} resources
            </Collapsible.Header>
            <Collapsible.Content>
              <SparkChartsSection
                snapshot={snapshot}
                metrics={[
                  {
                    metric: `endpoint.${endpoint}.count`,
                    label: 'requests',
                    formatter: number
                  },
                  {
                    metric: `endpoint.${endpoint}.duration.mean`,
                    label: 'load time',
                    formatter: millis
                  }
                ]}
              />
            </Collapsible.Content>
          </Collapsible>
        </div>
      ))}
    </div>
  );
}
