/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';

import { Card, Li, Stack, Ul } from '@instana/components';
import { Application, Website } from '@instana/types';
import { t } from '@instana/i18n-react';

import CheckboxFancy from 'in-components/form/CheckboxFancy/CheckboxFancy';
import SearchInput from 'in-components/SearchInput/SearchInput';

interface SloEntityTableProps {
  entityList?: Application[] | Website[];
  value?: Application | Website;
  onChange: React.Dispatch<React.SetStateAction<Application | Website | undefined>>;
}

export default function SloEntityTable({ value, onChange, entityList = [] }: SloEntityTableProps) {
  const [query, setQuery] = useState('');
  return (
    <>
      <Card
        title={'Select ' + t('in-service-levels:general.entityTypes.label', { context: value })}
        rightHeaderContent={<SearchInput query={query} onChange={q => setQuery(q)} />}
      >
        <Ul>
          {entityList
            .filter(({ label }) => label.includes(query))
            .map(({ label, id }) => {
              return (
                <Li key={id}>
                  <Stack direction="horizontal">
                    <CheckboxFancy
                      asRadioButton
                      value={label}
                      onChange={() => {
                        onChange({ id, label });
                      }}
                      checked={id === value?.id}
                    />
                    {label}
                  </Stack>
                </Li>
              );
            })}
        </Ul>
      </Card>
    </>
  );
}
