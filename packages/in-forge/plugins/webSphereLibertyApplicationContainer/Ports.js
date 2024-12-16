/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Collapsible, DescriptionList, DescriptionItem } from '@instana/components';

import { emptyMap } from 'in-services/fixedImmutables';
import { t } from 'in-i18n';

export default function Ports({ snapshot }) {
  const ports = snapshot.getIn(['data', 'ports'], emptyMap).toOrderedMap();
  if (ports.size === 0) {
    return null;
  }

  return (
    <div>
      <Collapsible initiallyOpen={false}>
        <Collapsible.Header>{t('in-forge:plugins.webSphereLibertyAppContainer.headerPorts')}</Collapsible.Header>
        <Collapsible.Content>
          <DescriptionList>
            {ports
              .map((portNumber, portName) => <DescriptionItem title={portName}>{portNumber}</DescriptionItem>)
              .valueSeq()}
          </DescriptionList>
        </Collapsible.Content>
      </Collapsible>
    </div>
  );
}
