/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { useState } from 'react';

import { ColumnizedContent, ColumnizedDefinition, KeyValue, Li, Spacer, Toggle } from '@instana/components';
import { t } from '@instana/i18n-react';

import { ApiTestResponse } from 'in-internal/thisUnit/WsApiTester/ApiResponseList';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper';
import { latency } from 'in-services/formatters/number';
import Label from 'in-components/form/Label';
import Code from 'in-components/Code';

import locals from './ApiResponseListItem.mless';

interface Props {
  response: ApiTestResponse;
  initialTimestamp: number;
}

interface ColumnProps extends Props {
  prettyPrint: boolean;
  setPrettyPrint: React.Dispatch<React.SetStateAction<boolean>>;
}

const columnDefinitions: ColumnizedDefinition[] = [
  {
    getContent({ response, prettyPrint }: ColumnProps) {
      const { payload } = response;
      return (
        <Code
          code={JSON.stringify(payload, null, prettyPrint ? 2 : 0)}
          lang="json"
          showLineNumbers={prettyPrint}
          softWrap
        />
      );
    }
  }
];

export default function ApiResponseListItem(props: Props) {
  const [prettyPrint, setPrettyPrint] = useState(false);
  const { response, initialTimestamp } = props;

  return (
    <Li>
      <header className={locals.listHeader}>
        <div className={locals.metadataContainer}>
          <KeyValue
            className={locals.keyValue}
            label={t('in-internal:thisUnit.wsApiTester.latencyLabel')}
            value={latency.detailed(response.timestamp - initialTimestamp)}
          />
          <HorizontalFlexWrapper>
            <Label className={locals.label}>{t('in-internal:thisUnit.wsApiTester.prettyPrintButtonLabel')}</Label>
            <Spacer horizontal="xxsmall" />
            <Toggle checked={prettyPrint} onToggle={e => setPrettyPrint(e)} />
          </HorizontalFlexWrapper>
        </div>
      </header>
      <ColumnizedContent
        columnDefinitions={columnDefinitions}
        {...props}
        prettyPrint={prettyPrint}
        setPrettyPrint={setPrettyPrint}
      />
    </Li>
  );
}
