/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import { emptyList } from 'in-services/fixedImmutables';
import Backends from '../Backends';
import { t } from 'in-i18n';
import Info from '../Info';

export default function VarnishSidebar({ snapshot }) {
  const backendNames = snapshot
    .getIn(['data', 'backend_names'], emptyList)
    .toArray()
    .sort();
  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>{t('in-forge:plugins.varnish.headerVarnish')}</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      {backendNames.map(bEnd => (
        <div key={bEnd}>
          <Collapsible initiallyOpen={false}>
            <Collapsible.Header>{t('in-forge:plugins.varnish.headerBackendName', { name: bEnd })}</Collapsible.Header>
            <Collapsible.Content>
              <Backends snapshot={snapshot} backend={bEnd} />
            </Collapsible.Content>
          </Collapsible>
        </div>
      ))}

      <ServiceInstancesList snapshot={snapshot} />
    </div>
  );
}
