/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Item, MapForm } from 'formalistic';
import React from 'react';

import { Li, Stack } from '@instana/components';

import TableSizeConfigurator from 'in-custom-dashboards/widgets/Table/infrastructure/components/TableSizeConfigurator';
import FilterConfigurator from 'in-custom-dashboards/widgets/Table/infrastructure/components/FilterConfigurator';
import GroupConfigurator from 'in-custom-dashboards/widgets/Table/infrastructure/components/GroupConfigurator';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import Sections from 'in-components/workspace/Sections/Sections';
import Header from 'in-components/workspace/Header';
import { TagCatalog } from 'in-types';
import { t } from 'in-i18n';

import locals from 'in-custom-dashboards/widgets/Table/infrastructure/components/TableConfigurator/TableConfigurator.mless';

export interface FormConfig {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  onChange: (path: string[], updater: (item: Item) => Item) => void;
  setTagFilterExpression: React.Dispatch<React.SetStateAction<FormModelElement[]>>;
  tagFilterExpression: FormModelElement[];
  tagCatalog?: TagCatalog;
}

export default function TableConfigurator({
  form,
  updateForm,
  setTagFilterExpression,
  tagFilterExpression,
  tagCatalog
}: FormConfig) {
  const tagFilterExpressionFieldValue = form.get('tagFilterExpression')?.value;

  return (
    <Stack gap="normal">
      <Header>{t('in-custom-dashboards:widgets.table.form.infrastructure.tableConfiguration')}</Header>
      <Sections>
        <Li component="div">{t('in-custom-dashboards:widgets.table.form.infrastructure.tableDetails')}</Li>
        <Li component="div" className={locals.content}>
          <Stack gap="xsmall">
            <Sections>
              <FilterConfigurator
                tagFilterExpression={tagFilterExpression}
                setTagFilterExpression={setTagFilterExpression}
                tagCatalog={tagCatalog}
              />
            </Sections>

            <Sections>
              <GroupConfigurator
                form={form}
                updateForm={updateForm}
                tagFilterExpression={tagFilterExpressionFieldValue ?? tagFilterExpression}
                tagCatalog={tagCatalog}
              />
            </Sections>

            <Sections>
              <TableSizeConfigurator form={form} updateForm={updateForm} />
            </Sections>
          </Stack>
        </Li>
      </Sections>
    </Stack>
  );
}
