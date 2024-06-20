/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Collapsible, DescriptionList, DescriptionItem } from '@instana/components';

import { t } from 'in-i18n';

export default function MatchExpressionList({ snapshot }: { snapshot: any }) {
  const matchExpressions = snapshot.getIn(['data', 'selector.matchExpressions']);

  if (!matchExpressions) {
    return null;
  }

  return (
    <Collapsible initiallyOpen>
      <Collapsible.Header>
        {t('in-forge:plugins.eum.matchExpressionsWithSize', { size: matchExpressions.size })}
      </Collapsible.Header>
      <Collapsible.Content>
        <DescriptionList>
          {matchExpressions
            .map((matchExpression: any) => (
              <DescriptionItem
                key={[matchExpression.get('key'), matchExpression.get('operator')].join(':')}
                title={matchExpression.get('key')}
              >
                {[matchExpression.get('operator'), matchExpression.get('values').join(', ')].join(' ')}
              </DescriptionItem>
            ))
            .toArray()}
        </DescriptionList>
      </Collapsible.Content>
    </Collapsible>
  );
}
