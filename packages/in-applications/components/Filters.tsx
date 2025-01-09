/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import { Button } from '@instana/components';
import { TagFilter } from '@instana/types';

import { useLinkToAnalyze as useLinkToApplicationAnalyze } from 'in-applications/navigation/paths';
import { or } from 'in-components/QueryBuilder/ConjunctionSelectorOverlay/supportedSelections';
import { type as tagFilterType } from 'in-components/QueryBuilder/transformation/tagFilter';
import { joinExpressions } from 'in-components/QueryBuilder/transformation/formModel';
import { CONTAINS, EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { getTechnologyComboBoxItems } from 'in-applications/technologyRegistry';
import { getEndpointTypesComboBoxItems } from 'in-applications/endpointTypes';
import ComboBox, { Option, Options } from 'in-components/ComboBox';
import { entityTypes } from 'in-analyze/applicationFilter';
import { t } from 'in-i18n';

import locals from './Filters.mless';

// import { get } from 'lodash';

export default function Filters({
  endpointTypes,
  restrictedEndpointTypes,
  technologies,
  restrictedTechnologies,
  setFilter,
  buttonLabel,
  applicationName,
  contextScope,
  serviceName,
  endpointName,
  boundaryScope,
  groupBy,
  query,
  callTypes = []
}: any) {
  const getLinkToApplicationAnalyze = useLinkToApplicationAnalyze();
  let queryFilter: Array<TagFilter> = [];
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
    expressions: endpointTypes.map((endpointTypes: string) => ({
      type: tagFilterType,
      name: 'call.type',
      value: endpointTypes,
      operator: EQUALS
    }))
  });
  const technologyFilters = joinExpressions({
    expressions: technologies.map((technology: string) => ({
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
        size="compact"
        kind="secondary"
        className={locals.button}
        href={getLinkToApplicationAnalyze({
          applicationName,
          serviceName,
          endpointName,
          dataSource: 'calls',
          groupBy,
          boundaryScope,
          contextScope,
          formModel: joinExpressions({ expressions: [queryFilter, endpointFilters, technologyFilters, callTypes] })
        })}
      >
        {buttonLabel}
      </Button>
      <ComboBox
        value={endpointTypes}
        onChange={(t: Option | Options | null) => {
          if (Array.isArray(t)) {
            return setFilter({ endpointTypes: t?.map((a: { value: string; labe: string }) => a.value) });
          }
        }}
        placeholder={t('in-applications:placeholderType')}
        isMulti
        options={getEndpointTypesComboBoxItems(restrictedEndpointTypes)}
        className={locals.filter}
      />
      <ComboBox
        value={technologies}
        onChange={(t: Option | Options | null) => {
          if (Array.isArray(t)) {
            return setFilter({ technologies: t?.map((a: any) => a.value) });
          }
        }}
        placeholder={t('in-applications:placeholderTechnology')}
        isMulti
        options={getTechnologyComboBoxItems(restrictedTechnologies)}
        className={locals.filter}
      />
    </Fragment>
  );
}
