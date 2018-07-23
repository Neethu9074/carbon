import React from 'react';

import { ClickableList, ClickableListItem } from 'in-sdk/components/sidebar/ClickableList';
import { getServiceDashboard } from 'in-applications/navigation/paths';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';

export default function App20ServicesPresenter({ result }) {
  // we are not showing progress/errors in the Infra 1.0 sidebars
  if (result.progress.loading || result.errors.length > 0 || result.data.items.length === 0) {
    return null;
  }

  return (
    <div>
      <Separator />

      <Collapsible initiallyOpen={false}>
        <Collapsible.Header>Services</Collapsible.Header>
        <Collapsible.Content>
          <ClickableList>
            {result.data.items.map(service => (
              <ClickableListItem key={service.id} href$={getServiceDashboard(service.id)}>
                {service.label}
              </ClickableListItem>
            ))}
          </ClickableList>
        </Collapsible.Content>
      </Collapsible>
    </div>
  );
}
