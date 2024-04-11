/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Collapsible } from '@instana/components';

import { ClickableList, ClickableListItem } from 'in-sdk/components/sidebar/ClickableList';
import { useLinkToServiceDashboard } from 'in-applications/navigation/paths';
import { t } from 'in-i18n';

export default function ServiceListPresenter({ result, header = t('in-sdk:services') }) {
  const getLinkToServiceDashboard = useLinkToServiceDashboard();
  // we are not showing progress/errors in the Infra 1.0 sidebars
  if (result.progress.loading || result.errors.length > 0 || result.data.items.length === 0) {
    return null;
  }

  return (
    <div>
      <Collapsible initiallyOpen={false}>
        <Collapsible.Header>{header}</Collapsible.Header>
        <Collapsible.Content>
          <ClickableList>
            {result.data.items.map(service => (
              <ClickableListItem key={service.id} href={getLinkToServiceDashboard({ serviceId: service.id })}>
                {service.label}
              </ClickableListItem>
            ))}
          </ClickableList>
        </Collapsible.Content>
      </Collapsible>
    </div>
  );
}
