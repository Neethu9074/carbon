/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import Stack from 'in-new-components/layout/Stack';
import HelpText from 'in-components/form/HelpText';
import { t } from 'in-i18n';

export default function ScopeConfigPresenter({ tagFilterFormModel, queryBuilder, scopePath }) {
  return (
    <Stack space="xsmall">
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

ScopeConfigPresenter.propTypes = {
  scopePath: PropTypes.element,
  queryBuilder: PropTypes.element,
  tagFilterFormModel: PropTypes.array
};
