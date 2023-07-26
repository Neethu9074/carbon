/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm } from 'formalistic';
import React from 'react';

import { Li, Stack } from '@instana/components';

import TableSizeConfigurator from 'in-custom-dashboards/widgets/Table/infrastructure/components/TableSizeConfigurator';
import Sections from 'in-components/workspace/Sections/Sections';
import Header from 'in-components/workspace/Header';
import { t } from 'in-i18n';

import locals from './TableConfigurator.mless';

export interface FormConfig {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
}

export default function TableConfigurator({ form, updateForm }: FormConfig) {
  return (
    <Stack gap="normal">
      <Header>{t('in-custom-dashboards:widgets.table.form.infrastructure.tableConfiguration')}</Header>
      <Sections>
        <Li component="div">{t('in-custom-dashboards:widgets.table.form.infrastructure.tableDetails')}</Li>
        <Li component="div" className={locals.content}>
          <Stack gap="xsmall">
            <Sections>
              <TableSizeConfigurator form={form} updateForm={updateForm} />
            </Sections>
            {/* <Sections> Add query builder for filtering </Sections>*/}
          </Stack>
        </Li>
      </Sections>
    </Stack>
  );
}
