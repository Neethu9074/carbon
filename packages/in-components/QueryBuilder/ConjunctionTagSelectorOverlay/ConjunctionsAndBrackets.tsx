/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Button } from '@instana/components';

import {
  OPEN_BRACKET,
  CLOSE_BRACKET,
  CONJUNCTION,
  FormModelElement
} from 'in-components/QueryBuilder/transformation/formModel';
import { and, or } from 'in-components/QueryBuilder/ConjunctionSelectorOverlay/supportedSelections';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import { t } from 'in-i18n';

import locals from './ConjunctionsAndBrackets.mless';

interface ConjunctionTagSelectorOverlayProps {
  onChange: (formModel: FormModelElement) => void;
  withoutOrConjunction?: boolean;
  withoutBrackets?: boolean;
}
export default function ConjunctionsAndBrackets({
  onChange,
  withoutOrConjunction = false,
  withoutBrackets = false
}: ConjunctionTagSelectorOverlayProps) {
  return (
    <HorizontalFlexWrapper className={locals.wrapper}>
      <div>
        <Button
          size="compact"
          kind="action"
          onClick={e => {
            stopPropagationAndPreventDefault(e);
            onChange({
              type: CONJUNCTION,
              logicalOperator: and
            });
          }}
        >
          {t('in-components:queryBuilder.selectorOverlayAnd')}
        </Button>
        {!withoutOrConjunction && (
          <Button
            size="compact"
            kind="action"
            onClick={e => {
              stopPropagationAndPreventDefault(e);
              onChange({
                type: CONJUNCTION,
                logicalOperator: or
              });
            }}
          >
            {t('in-components:queryBuilder.selectorOverlayOr')}
          </Button>
        )}
      </div>
      {!withoutBrackets && (
        <div>
          <Button
            size="compact"
            kind="action"
            onClick={e => {
              stopPropagationAndPreventDefault(e);
              onChange({ type: OPEN_BRACKET });
            }}
          >
            (
          </Button>
          <Button
            size="compact"
            kind="action"
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
