/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import PropTypes from 'prop-types';
import React from 'react';

import WithQB1orQB2 from 'in-alerting/components/WithQB1orQB2';
import Stack from 'in-new-components/layout/Stack';
import HelpText from 'in-components/form/HelpText';
import { t } from 'in-i18n';

export default function ScopeConfigPresenter({
  convertedTagFilterExpression,
  tagFilterFormModel,
  queryBuilder,
  tagFilterList,
  scopePath
}) {
  return (
    <Stack space="xsmall">
      <WithQB1orQB2
        onUsesQB1={() => tagFilterList}
        onUsesQB2={() => (
          <>
            {scopePath}
            {tagFilterFormModel.length > 0 && (
              <>
                <HelpText>{t('in-alerting:components.scopeConfigPresenterHelpTextAdditionalFilters')}</HelpText>
                {queryBuilder}
              </>
            )}
          </>
        )}
        shouldFallbackToQB2={isQB2Config => isQB2Config(convertedTagFilterExpression)}
      />
    </Stack>
  );
}

ScopeConfigPresenter.propTypes = {
  convertedTagFilterExpression: PropTypes.bool,
  scopePath: PropTypes.element,
  queryBuilder: PropTypes.element,
  tagFilterFormModel: PropTypes.array,
  tagFilterList: PropTypes.element
};
