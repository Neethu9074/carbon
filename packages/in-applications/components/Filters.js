/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import { Button } from '@instana/components';

import { or } from 'in-components/QueryBuilder/ConjunctionSelectorOverlay/supportedSelections';
import { type as tagFilterType } from 'in-components/QueryBuilder/transformation/tagFilter';
import { joinExpressions } from 'in-components/QueryBuilder/transformation/formModel';
import { CONTAINS, EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { getTechnologyComboBoxItems } from 'in-applications/technologyRegistry';
import { getEndpointTypesComboBoxItems } from 'in-applications/endpointTypes';
import { getLinkToAnalyze } from 'in-applications/navigation/paths';
import { entityTypes } from 'in-analyze/applicationFilter';
import ComboBox from 'in-components/ComboBox';
import { t } from 'in-i18n';

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
  groupBy,
  query
}) {
  let queryFilter = [];
  if (query) {
    if (serviceName) {
      queryFilter = [
        {
          type: tagFilterType,
          name: 'endpoint.name',
          value: query,
          operator: CONTAINS,
          entity: entityTypes.DESTINATION
        }
      ];
    } else {
      queryFilter = [
        { type: tagFilterType, name: 'service.name', value: query, operator: CONTAINS, entity: entityTypes.DESTINATION }
      ];
    }
  }

  // TODO: https://instana.kanbanize.com/ctrl_board/66/cards/50518/details/
  // filtering by multiple call.type tag filters connected with AND is not supported, using OR as a work-around
  const endpointFilters = joinExpressions({
    logicalOperator: or,
    expressions: endpointTypes.map(endpointTypes => ({
      type: tagFilterType,
      name: 'call.type',
      value: endpointTypes,
      operator: EQUALS
    }))
  });

  const technologyFilters = joinExpressions({
    expressions: technologies.map(technology => ({
      type: tagFilterType,
      name: 'technology',
      value: technology,
      operator: EQUALS,
      entity: entityTypes.DESTINATION
    }))
  });

  return (
    <Fragment>
      <Button
        kind="secondary"
        className={locals.button}
        href$={getLinkToAnalyze({
          applicationName,
          serviceName,
          endpointName,
          dataSource: 'calls',
          groupBy,
          boundaryScope,
          formModel: joinExpressions({ expressions: [queryFilter, endpointFilters, technologyFilters] })
        })}
      >
        {buttonLabel}
      </Button>
      <ComboBox
        value={endpointTypes}
        onChange={t => setFilter({ endpointTypes: t.map(a => a.value) })}
        placeholder={t('in-applications:placeholderType')}
        multi
        options={getEndpointTypesComboBoxItems(restrictedEndpointTypes)}
        className={locals.filter}
      />
      <ComboBox
        value={technologies}
        onChange={t => setFilter({ technologies: t.map(a => a.value) })}
        placeholder={t('in-applications:placeholderTechnology')}
        multi
        options={getTechnologyComboBoxItems(restrictedTechnologies)}
        className={locals.filter}
      />
    </Fragment>
  );
}
