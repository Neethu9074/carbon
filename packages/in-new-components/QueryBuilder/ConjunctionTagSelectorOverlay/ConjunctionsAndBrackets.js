/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import { Button } from '@instana/components';

import { OPEN_BRACKET, CLOSE_BRACKET, CONJUNCTION } from 'in-new-components/QueryBuilder/transformation/formModel';
import { and, or } from 'in-new-components/QueryBuilder/ConjunctionSelectorOverlay/supportedSelections';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import { t } from 'in-i18n';

import locals from './ConjunctionsAndBrackets.mless';

export default function ConjunctionsAndBrackets({ onChange, withoutOrConjunction = false, withoutBrackets = false }) {
  return (
    <HorizontalFlexWrapper className={locals.wrapper}>
      <div>
        <Button
          size="compact"
          kind="secondary"
          onClick={e => {
            stopPropagationAndPreventDefault(e);
            onChange({
              type: CONJUNCTION,
              logicalOperator: and
            });
          }}
        >
          {t('in-new-components:queryBuilder.selectorOverlayAnd')}
        </Button>
        {!withoutOrConjunction && (
          <Button
            size="compact"
            kind="secondary"
            onClick={e => {
              stopPropagationAndPreventDefault(e);
              onChange({
                type: CONJUNCTION,
                logicalOperator: or
              });
            }}
          >
            {t('in-new-components:queryBuilder.selectorOverlayOr')}
          </Button>
        )}
      </div>
      {!withoutBrackets && (
        <div>
          <Button
            size="compact"
            kind="secondary"
            onClick={e => {
              stopPropagationAndPreventDefault(e);
              onChange({ type: OPEN_BRACKET });
            }}
          >
            (
          </Button>
          <Button
            size="compact"
            kind="secondary"
            onClick={e => {
              stopPropagationAndPreventDefault(e);
              onChange({ type: CLOSE_BRACKET });
            }}
          >
            )
          </Button>
        </div>
      )}
    </HorizontalFlexWrapper>
  );
}

ConjunctionsAndBrackets.propTypes = {
  onChange: PropTypes.func.isRequired,
  withoutOrConjunction: PropTypes.bool,
  withoutBrackets: PropTypes.bool
};
