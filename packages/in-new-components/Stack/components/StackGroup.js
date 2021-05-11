/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { ListGroup, Li } from '@instana/components';

import StackItem from 'in-new-components/Stack/components/StackItem';
import { getPluginName } from 'in-sdk/pluginName';
import { t } from 'in-i18n';

import locals from './StackGroup.mless';

export default function StackGroup({
  applicationId,
  boundaryScope,
  serviceId,
  group: { relationship, type, items, itemCount },
  tab,
  syntheticCalls
}) {
  const numMoreItems = itemCount - items.length;

  return (
    <ListGroup
      label={
        <>
          {t('in-new-components:stack.relationship', {
            context: relationship,
            itemCount: itemCount,
            plugin: getPluginName(type, itemCount)
          })}
        </>
      }
    >
      {items.map(item => (
        <StackItem
          key={item.id}
          applicationId={applicationId}
          boundaryScope={boundaryScope}
          serviceId={serviceId}
          item={item}
          tab={tab}
          syntheticCalls={syntheticCalls}
        />
      ))}
      {numMoreItems > 0 && (
        <Li className={locals.loadMore} noAlternatingBg>
          {t('in-new-components:list.labelMoreItems', { numMoreItems: numMoreItems })}
        </Li>
      )}
    </ListGroup>
  );
}
