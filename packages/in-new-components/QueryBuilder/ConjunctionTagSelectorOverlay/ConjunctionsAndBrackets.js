import PropTypes from 'prop-types';
import React from 'react';

import { OPEN_BRACKET, CLOSE_BRACKET, CONJUNCTION } from 'in-new-components/QueryBuilder/transformation/formModel';
import { and, or } from 'in-new-components/QueryBuilder/ConjunctionSelectorOverlay/supportedSelections';
import HorizontalFlexWrapper from 'in-new-components/layout/HorizontalFlexWrapper';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import Button from 'in-new-components/Button';

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
          AND
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
            OR
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
