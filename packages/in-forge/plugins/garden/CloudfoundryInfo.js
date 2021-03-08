/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import getCloudfoundryApplication from 'in-cloudfoundry/subscriptions/getCloudfoundryApplication';
import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { getApplicationDashboard } from 'in-cloudfoundry/navigation/paths';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';
import { t } from 'in-i18n';

export default connectTo(
  ({ snapshot }) => ({
    application: timeConfig$.flatMap(timeConfig =>
      getCloudfoundryApplication({
        filter: {
          containerId: snapshot.get('id'),
          timeConfig: timeConfig
        }
      }).map(result => result.data)
    )
  }),

  function CloudfoundryInfo({ application }) {
    if (!application) {
      return null;
    }

    const { id, label, space, organization } = application;
    return (
      <Collapsible>
        <Collapsible.Header>{t('in-forge:plugins.garden.cloudFoundry')}</Collapsible.Header>
        <Collapsible.Content>
          <DescriptionList>
            <DescriptionItem title={t('in-forge:plugins.garden.application')}>
              <Link href$={getApplicationDashboard(id)}>{label}</Link>
            </DescriptionItem>
            <DescriptionItem title={t('in-forge:plugins.garden.space')}>{space}</DescriptionItem>
            <DescriptionItem title={t('in-forge:plugins.garden.organization')}>{organization}</DescriptionItem>
          </DescriptionList>
        </Collapsible.Content>
      </Collapsible>
    );
  }
);
