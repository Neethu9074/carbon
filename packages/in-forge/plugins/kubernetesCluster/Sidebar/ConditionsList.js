/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Collapsible, DescriptionList, DescriptionItem } from '@instana/components';

import { emptyList } from 'in-services/fixedImmutables';
import { t } from 'in-i18n';

export default function ConditionsList({ snapshot }) {
  const conditions = snapshot.getIn(['data', 'conditions'], emptyList);

  if (conditions.size === 0) {
    return null;
  }

  return (
    <div>
      <Collapsible initiallyOpen={false}>
        <Collapsible.Header>
          {t('in-forge:plugins.kubernetesCluster.conditionsSize', { size: conditions.size })}
        </Collapsible.Header>
        <Collapsible.Content>
          <DescriptionList>
            {conditions.toArray().map(cond => (
              <DescriptionItem key={cond.get('type')} title={cond.get('type') + '=' + cond.get('status')}>
                @ {cond.get('lastTransitionTime')}
                <br /> {cond.get('message')}
              </DescriptionItem>
            ))}
          </DescriptionList>
        </Collapsible.Content>
      </Collapsible>
    </div>
  );
}
