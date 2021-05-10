/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import StackItem from 'in-new-components/Stack/components/StackItem';
import { ListGroup } from 'in-new-components/lists/List';
import { getPluginName } from 'in-sdk/pluginName';
import { t } from 'in-i18n';

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
      numMoreItems={numMoreItems}
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
    </ListGroup>
  );
}
