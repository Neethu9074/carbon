/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import Region from 'in-forge/plugins/azureCosmosDb/Dashboard/Region';
import { emptyMap, emptyList } from 'in-services/fixedImmutables';
import ExpandableCard from 'in-components/ExpandableCard';

import locals from './RegionsTable.mless';

export default function RegionsTable({ snapshot, timeConfig }) {
  var regions = emptyList;
  var databases = emptyList;
  var collections = emptyList;
  var statusCodes = emptyList;
  var resourceTypes = emptyList;

  var rows = emptyList;

  const regionsMeta = 'meta.regions';
  const databasesMeta = 'meta.databases';
  const collectionsMeta = 'meta.collections';
  const statusCodesMeta = 'meta.statusCodes';
  const resourceTypesMeta = 'meta.resourceTypes';

  snapshot.getIn(['data'], emptyMap).mapKeys(dataKey => {
    if (dataKey.startsWith(regionsMeta)) {
      var regionKey = dataKey.substring(regionsMeta.length + 1);
      if (regionKey == '<empty>') return;
      if (!regions.has(regionKey)) {
        regions = regions.push(regionKey);
        rows = rows.push({
          key: regionKey,
          name: snapshot.getIn(['data', 'meta.regions.' + regionKey])
        });
      }
    } else if (dataKey.startsWith(databasesMeta)) {
      var databaseKey = dataKey.substring(databasesMeta.length + 1);
      if (databaseKey.endsWith('__Empty') || databaseKey.endsWith('<empty>')) return;
      if (!databases.has(databaseKey)) databases = databases.push(databaseKey);
    } else if (dataKey.startsWith(collectionsMeta)) {
      var collectionKey = dataKey.substring(collectionsMeta.length + 1);
      if (!collections.has(collectionKey)) collections = collections.push(collectionKey);
    } else if (dataKey.startsWith(statusCodesMeta)) {
      var statusKey = dataKey.substring(statusCodesMeta.length + 1);
      if (!statusCodes.has(statusKey)) statusCodes = statusCodes.push(statusKey);
    } else if (dataKey.startsWith(resourceTypesMeta)) {
      var resourceKey = dataKey.substring(resourceTypesMeta.length + 1);
      if (!resourceTypes.has(resourceKey)) resourceTypes = resourceTypes.push(resourceKey);
    }
  });

  return (
    <>
      {rows.map(region => (
        <ExpandableCard key={region.key} className={locals.card} title={region.name}>
          <Region
            snapshot={snapshot}
            timeConfig={timeConfig}
            region={region.key}
            databases={databases}
            collections={collections}
            statusCodes={statusCodes}
            resourceTypes={resourceTypes}
          />
        </ExpandableCard>
      ))}
    </>
  );
}
