/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ReactNode } from 'react';

import { Stack } from '@instana/components';

import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { QueryBuilderComponent } from 'in-components/QueryBuilder';
import HelpText from 'in-components/form/HelpText';
import { t } from 'in-i18n';

export default function ScopeConfigPresenter({
  tagFilterFormModel,
  queryBuilder,
  scopePath
}: {
  tagFilterFormModel: FormModelElement[];
  queryBuilder: QueryBuilderComponent;
  scopePath: ReactNode;
}) {
  return (
    <Stack gap="xsmall">
      {scopePath}
      {tagFilterFormModel.length > 0 && (
        <>
          <HelpText>{t('in-alerting:components.scopeConfigPresenterHelpTextAdditionalFilters')}</HelpText>
          {queryBuilder}
        </>
      )}
    </Stack>
  );
}
