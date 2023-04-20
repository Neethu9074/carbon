/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';

import { Card, Li, Stack, Ul } from '@instana/components';
import { t } from '@instana/i18n-react';

import CheckboxFancy from 'in-components/form/CheckboxFancy/CheckboxFancy';
import SearchInput from 'in-components/SearchInput/SearchInput';
export default function SloEntityTable({ value, chooseValue }: { value: string; chooseValue: any }) {
  const [checked, setChecked] = useState('');
  const [query, setQuery] = useState('');
  const App = [
    { id: 1, name: 'Application 1' },
    { id: 2, name: 'Application 2' },
    { id: 3, name: 'Application 3' }
  ];
  const Web = [
    { id: 1, name: 'Website 1' },
    { id: 2, name: 'Website 2' },
    { id: 3, name: 'Website 3' }
  ];

  return (
    <>
      <Card
        title={'Select ' + t('in-service-levels:general.entityTypes.label', { context: value })}
        rightHeaderContent={<SearchInput query={query} onChange={q => setQuery(q)} />}
      >
        <Ul>
          {(value === 'application' ? App : Web)
            .filter(({ name }) => name.includes(query))
            .map(({ name, id }) => {
              return (
                <Li key={id}>
                  <Stack direction="horizontal">
                    <CheckboxFancy
                      asRadioButton
                      value={name}
                      onChange={e => {
                        setChecked(e.target.value);
                        chooseValue(e.target.value);
                      }}
                      checked={name === checked}
                    />
                    {name}
                  </Stack>
                </Li>
              );
            })}
        </Ul>
      </Card>
    </>
  );
}
