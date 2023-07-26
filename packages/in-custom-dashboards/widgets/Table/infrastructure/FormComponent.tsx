/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Item, MapForm } from 'formalistic';
import React from 'react';

import { Spacer, Stack } from '@instana/components';

import TableConfigurator from 'in-custom-dashboards/widgets/Table/infrastructure/components/TableConfigurator/TableConfigurator';
import EntityInfraTypeSelector from 'in-custom-dashboards/widgets/Table/infrastructure/components/EntityInfraTypeSelector';
import { useFormatterFormSideEffects } from 'in-custom-dashboards/widgets/_shared/useFormatterFormSideEffects';
import { EMPTY_EXPRESSION } from 'in-components/QueryBuilder/transformation/backendQueryModel';
//@ts-expect-error
import { defaultOrder } from 'in-infrastructure/Explore/constants';
import Sections from 'in-components/workspace/Sections';
import useTimeConfig from 'in-hooks/useTimeConfig';

interface Props {
  form: MapForm<any>;
  onChange: (path: string[], updater: (item: Item) => Item) => void;
}

export function InfrastructureTableForm({ form, onChange }: Props) {
  const timeConfig = useTimeConfig();

  const updateForm = useFormatterFormSideEffects(form, updatedForm => {
    onChange([], () => updatedForm);
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
          updateForm={updateForm}
        />
      </Sections>

      <Spacer vertical="medium" />

      <TableConfigurator form={form} updateForm={updateForm} />
    </Stack>
  );
}
