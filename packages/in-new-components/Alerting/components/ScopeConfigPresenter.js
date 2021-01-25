/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import PropTypes from 'prop-types';
import { t } from 'in-i18n';
import React from 'react';

import WithQB1orQB2 from 'in-new-components/Alerting/components/WithQB1orQB2';
import ScopePath from 'in-new-components/Alerting/components/ScopePath';
import Stack from 'in-new-components/layout/Stack/Stack';
import HelpText from 'in-components/form/HelpText';

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
            <ScopePath {...scopePath} />
            {tagFilterFormModel.length > 0 && (
              <>
                <HelpText>
                  {t('in-new-components:alerting.components.scopeConfigPresenterHelpTextAdditionalFilters')}
                </HelpText>
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
  scopePath: PropTypes.shape({
    applicationName: PropTypes.string.isRequired,
    serviceName: PropTypes.string,
    endpointName: PropTypes.string
  }),
  queryBuilder: PropTypes.element,
  tagFilterFormModel: PropTypes.array,
  tagFilterList: PropTypes.element
};
