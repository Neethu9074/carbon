/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import MetricTypes from '../MetricTypes';
import { t } from 'in-i18n';
import Info from '../Info';

export default function DominoSidebar({ snapshot }) {
  console.log(snapshot);
  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>{t('in-forge:plugins.domino.dashboard.metricTypes')}</Collapsible.Header>
        <Collapsible.Content>
          <MetricTypes snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <Collapsible initiallyOpen>
        <Collapsible.Header>{t('in-forge:plugins.domino.dashboard.info')}</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>
    </div>
  );
}
