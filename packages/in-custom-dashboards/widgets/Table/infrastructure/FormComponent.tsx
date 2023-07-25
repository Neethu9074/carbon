/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Field, Item, MapForm } from 'formalistic';
import React from 'react';

import { Spacer, Stack } from '@instana/components';

import Sections from 'in-components/workspace/Sections';

export function InfrastructureTableForm(_props: {
  form: MapForm<{ source: Field<string>; type: Field<string> }>;
  onChange: (path: string[], updater: (item: Item) => Item) => void;
}) {
  return (
    <Stack gap="normal">
      <Sections>
        please select an entity type ...
        {/* can not be used, because it will change the browser url:
        <TypeSelector />
        */}
      </Sections>
      <Spacer vertical="medium" />
    </Stack>
  );
}
