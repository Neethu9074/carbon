/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import RELATIONSHIP_MAP from 'in-new-components/Stack/relationships.json';
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

  return (
    <ListGroup
      label={
        <>
          {RELATIONSHIP_MAP[relationship]} {itemCount} {itemCount > 1 ? getPlural(type) : getSingular(type)}
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
