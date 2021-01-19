/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { Fragment } from 'react';

import { getTagCatalog } from 'in-applications/analyze/components/workspace/CallQueryBuilder';
import { getTechnologyComboBoxItems } from 'in-applications/technologyRegistry';
import { getEndpointTypesComboBoxItems } from 'in-applications/endpointTypes';
import useTagCatalog from 'in-applications/hooks/useTagCatalog';
import { getLinkToAnalyze } from 'in-analyze/navigation/paths';
import { entityTypes } from 'in-analyze/applicationFilter';
import Button from 'in-new-components/Button';
import ComboBox from 'in-components/ComboBox';

import locals from './Filters.mless';

export default function Filters({
  endpointTypes,
  restrictedEndpointTypes,
  technologies,
  restrictedTechnologies,
  setFilter,
  buttonLabel,
  applicationName,
  serviceName,
  endpointName,
  boundaryScope,
  groupByTag,
  query
}) {
  let queryFilter = [];
  let endpointFilters = [];
  let technologyFilters = [];

  const tagCatalog = useTagCatalog(getTagCatalog);
  if (query) {
    if (applicationName || (!applicationName && !serviceName)) {
      queryFilter = [{ name: 'service.name', value: query, operator: 'CONTAINS', entity: entityTypes.DESTINATION }];
    } else if (serviceName) {
      queryFilter = [{ name: 'endpoint.name', value: query, operator: 'CONTAINS', entity: entityTypes.DESTINATION }];
    }
  }

  endpointTypes.map(type => endpointFilters.push({ name: 'call.type', value: type, operator: 'EQUALS' }));
  technologies.map(type =>
    technologyFilters.push({ name: 'technology', value: type, operator: 'EQUALS', entity: entityTypes.DESTINATION })
  );

  return (
    <Fragment>
      <Button
        kind="secondary"
        className={locals.button}
        href$={
          tagCatalog &&
          getLinkToAnalyze({
            applicationName,
            serviceName,
            endpointName,
            dataSource: 'calls',
            groupByTag,
            boundaryScope,
            filters: [...queryFilter, ...endpointFilters, ...technologyFilters],
            tagCatalog
          })
        }
      >
        Analyze {buttonLabel}
      </Button>
      <ComboBox
        value={endpointTypes}
        onChange={t => setFilter({ endpointTypes: t.map(a => a.value) })}
        placeholder="Type…"
        multi
        options={getEndpointTypesComboBoxItems(restrictedEndpointTypes)}
        className={locals.filter}
      />
      <ComboBox
        value={technologies}
        onChange={t => setFilter({ technologies: t.map(a => a.value) })}
        placeholder="Technology…"
        multi
        options={getTechnologyComboBoxItems(restrictedTechnologies)}
        className={locals.filter}
      />
    </Fragment>
  );
}
