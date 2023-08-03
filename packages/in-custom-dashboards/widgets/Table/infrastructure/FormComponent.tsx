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
import EntityInfraTypeSelector, {
  entityType
} from 'in-custom-dashboards/widgets/Table/infrastructure/components/EntityInfraTypeSelector';
import TableConfigurator from 'in-custom-dashboards/widgets/Table/infrastructure/components/TableConfigurator/TableConfigurator';
import { useFormatterFormSideEffects } from 'in-custom-dashboards/widgets/_shared/useFormatterFormSideEffects';
import { EMPTY_EXPRESSION } from 'in-components/QueryBuilder/transformation/backendQueryModel';
//@ts-expect-error
import { defaultOrder } from 'in-infrastructure/Explore/constants';
import useTagCatalog from 'in-infrastructure/hooks/useTagCatalog';
import { pendingResult } from 'in-services/fixedObjects';
import Sections from 'in-components/workspace/Sections';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { success } from 'in-services/util/result';

interface Props {
  form: MapForm<any>;
  onChange: (path: string[], updater: (item: Item) => Item) => void;
}

export function InfrastructureTableForm({ form, onChange }: Props) {
  const type = form.get(entityType)?.value;
  const timeConfig = useTimeConfig();
  const tagCatalog = useTagCatalog({ ownerType: type });

  const updateForm = useFormatterFormSideEffects(form, updatedForm => {
    onChange([], () => updatedForm);
  });

  const [tagFilterExpression, setTagFilterExpression] = useTagFilterExpressionState({
    tagCatalogResult: tagCatalog ? success(tagCatalog) : pendingResult,
    form,
    onChange
  });

  return (
    <Stack gap="normal">
      <Sections>
        <EntityInfraTypeSelector
          backendQueryModel={EMPTY_EXPRESSION}
          form={form}
          order={defaultOrder}
          setOrder={() => null}
          timeConfig={timeConfig}
          setTagFilterExpression={setTagFilterExpression}
          updateForm={updateForm}
        />
      </Sections>

      <Spacer vertical="medium" />

      <TableConfigurator
        form={form}
        updateForm={updateForm}
        onChange={onChange}
        tagFilterExpression={tagFilterExpression}
        setTagFilterExpression={setTagFilterExpression}
        tagCatalog={tagCatalog}
      />
    </Stack>
  );
}
