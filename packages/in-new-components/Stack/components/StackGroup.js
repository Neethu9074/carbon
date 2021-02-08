/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import StackItem from 'in-new-components/Stack/components/StackItem';
import { getSingular, getPlural } from 'in-sdk/pluginName';
import { ListGroup } from 'in-new-components/lists/List';

export default function StackGroup({
  applicationId,
  boundaryScope,
  serviceId,
  group: { relationship, type, items, itemCount },
  tab
}) {
  const numMoreItems = itemCount - items.length;
  /* TODO: In order to properly handle the plural form for plug-in name in the ListGroup below,
   * would need to implement the getResourceKey function in in-sdk/pluginName
   * and add the pluginName.resourceKey property to all the registerSnapshotDefinition in in-forge/plugins/[plugin]/index.js
   */
  return (
    <ListGroup
      label={
        <>
          {t('in-new-components:stack.relationship.' + relationship, {
            itemCount: itemCount,
            plugin: itemCount > 1 ? getPlural(type) : getSingular(type)
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
        />
      ))}
    </ListGroup>
  );
}
