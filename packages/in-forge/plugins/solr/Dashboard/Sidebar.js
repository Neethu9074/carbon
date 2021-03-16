/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import { emptyList } from 'in-services/fixedImmutables';
import SolrCoreInfo from '../SolrCoreInfo';
import { t } from 'in-i18n';
import Info from '../Info';

export default function SolrSidebar({ snapshot }) {
  const coreNames = snapshot
    .getIn(['data', 'core_names'], emptyList)
    .toArray()
    .sort();

  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>Solr</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      {coreNames.map(cn => (
        <div key={cn}>
          <Collapsible initiallyOpen={false}>
            <Collapsible.Header>{t('in-forge:plugins.solr.dashboard.coreWithName', { name: cn })}</Collapsible.Header>
            <Collapsible.Content>
              <SolrCoreInfo snapshot={snapshot} core={cn} />
            </Collapsible.Content>
          </Collapsible>
        </div>
      ))}

      <ServiceInstancesList snapshot={snapshot} />
    </div>
  );
}
