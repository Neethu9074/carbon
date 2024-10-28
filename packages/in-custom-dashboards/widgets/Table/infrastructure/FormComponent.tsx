/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Item, MapForm } from 'formalistic';
import React from 'react';

import { Spacer, Stack } from '@instana/components';

//@ts-expect-error
import { useTagFilterExpressionState } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/tagFilterUtils/useTagFilterExpressionState';
import TableConfigurator from 'in-custom-dashboards/widgets/Table/infrastructure/components/TableConfigurator/TableConfigurator';
import EntityInfraTypeSelector from 'in-custom-dashboards/widgets/Table/infrastructure/components/EntityInfraTypeSelector';
import DatasetsConfigurator from 'in-custom-dashboards/widgets/Table/infrastructure/components/DatasetsConfigurator';
import { useFormatterFormSideEffects } from 'in-custom-dashboards/widgets/_shared/useFormatterFormSideEffects';
import { entityType, source as sourceFieldName } from 'in-custom-dashboards/widgets/Table/infrastructure/form';
import useInfrastructureEntities from 'in-infrastructure/Explore/hooks/useInfrastructureEntities';
import { EMPTY_EXPRESSION } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { defaultOrder } from 'in-infrastructure/Explore/constants';
import useTagCatalog from 'in-infrastructure/hooks/useTagCatalog';
import { pendingResult } from 'in-services/fixedObjects';
import Sections from 'in-components/workspace/Sections';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { success } from 'in-services/util/result';

const MAX_DATASETS = 5;

interface Props {
  form: MapForm<any>;
  onChange: (path: string[], updater: (item: Item) => Item) => void;
}

export function InfrastructureTableForm({ form, onChange }: Props) {
  const type = form.get(entityType)?.value;
  const source = form.get(sourceFieldName)?.value;
  const timeConfig = useTimeConfig();
  const tagCatalog = useTagCatalog({ ownerType: type });

  const updateForm = useFormatterFormSideEffects(form, updatedForm => {
    onChange([], () => updatedForm);
  });

  const [tagFilterExpression, setTagFilterExpression] = useTagFilterExpressionState({
    tagCatalogResult: tagCatalog ? success(tagCatalog) : pendingResult,
    form,
    onChange,
    disableEntitySelection: true
  });

  const { tableResult } = useInfrastructureEntities({
    backendQueryModel: EMPTY_EXPRESSION,
    timeConfig,
    order: defaultOrder,
    setOrder: () => null,
    query: '',
    setQuery: () => null
  });

  const entityItems = tableResult?.data?.items;
  const entityLabel = findEntityLabelByType(type, entityItems);

  return (
    <Stack gap="normal">
      <Sections>
        <EntityInfraTypeSelector
          entityItems={entityItems}
          form={form}
          setTagFilterExpression={setTagFilterExpression}
          updateForm={updateForm}
        />
      </Sections>

      {type && (
        <>
          <Spacer vertical="medium" />
          <DatasetsConfigurator
            form={form}
            onChange={onChange}
            updateForm={updateForm}
            entityType={type}
            source={source}
            maxLength={MAX_DATASETS}
          />

          <Spacer vertical="medium" />

          <TableConfigurator
            form={form}
            updateForm={updateForm}
            onChange={onChange}
            tagFilterExpression={tagFilterExpression}
            setTagFilterExpression={setTagFilterExpression}
            tagCatalog={tagCatalog}
            entityLabel={entityLabel}
          />
        </>
      )}
    </Stack>
  );
}

function findEntityLabelByType(
  type: string,
  items: Array<{ type: string; label: string; count: number }>
): string | null {
  const foundEntity = items?.find(entity => entity.type === type);

  return foundEntity?.label || null;
}
