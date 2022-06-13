/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Card, Ul, Li } from '@instana/components';

import { KubernetesListItemWithCursor } from 'in-kubernetes/subscriptions/exploreKubernetes';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable';
import { ClusterRow } from 'in-kubernetes/explore/ClusterRow';
import { t } from 'in-i18n';

interface ClusterListProps {
  resources: KubernetesListItemWithCursor[];
}

export function ClusterList({ resources }: ClusterListProps) {
  return (
    <Card title={t('in-kubernetes:clusters')}>
      <Ul>
        {resources.map(item => (
          <ClusterRow item={item.item} />
        ))}
        {resources.length === 0 && (
          <Li>
            <NoDataAvailable text={t('in-kubernetes:dashboards.noClusterDataAvailable')} height={80} />
          </Li>
        )}
      </Ul>
    </Card>
  );
}
