/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import { emptyMap } from 'in-services/fixedImmutables';
import { t } from 'in-i18n';

export default function JbossDataGridPorts({ snapshot }) {
  const ports = snapshot.getIn(['data', 'ports'], emptyMap);

  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>{t('in-forge:plugins.jbossDataGrid.ports')}</Collapsible.Header>
        <Collapsible.Content>
          <DescriptionList>
            {ports
              .map((port, portName) => (
                <DescriptionItem title={portName} key={portName}>
                  {port}
                </DescriptionItem>
              ))
              .valueSeq()
              .toArray()}
          </DescriptionList>
        </Collapsible.Content>
      </Collapsible>
    </div>
  );
}
