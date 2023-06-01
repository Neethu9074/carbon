/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';

import { Card, Li, Stack, Ul } from '@instana/components';
import { Application, Website } from '@instana/types';
import { t } from '@instana/i18n-react';

import {
  ApplicationSloForm,
  sloApplicationIdKey,
  sloEntityKey,
  sloEntityTypeKey,
  sloWebsiteIdKey,
  WebsiteSloForm
} from 'in-service-levels/components/ConfigDialog/form';
import CheckboxFancy from 'in-components/form/CheckboxFancy/CheckboxFancy';
import SearchInput from 'in-components/SearchInput/SearchInput';

interface SloEntityTableProps {
  entityList?: Application[] | Website[];
  // form: SloForm<SloEntityType>;
  form: ApplicationSloForm | WebsiteSloForm;
  // onChange: React.Dispatch<React.SetStateAction<Application | Website | undefined>>;
  onChange: (val: string) => void;
}

export default function SloEntityTable({ form, entityList, onChange }: SloEntityTableProps) {
  const [query, setQuery] = useState('');
  const entity = form.get(sloEntityTypeKey).value;
  const reslt =
    entity === 'application'
      ? (form as ApplicationSloForm).getIn([sloEntityKey, sloApplicationIdKey]).value
      : (form as WebsiteSloForm).getIn([sloEntityKey, sloWebsiteIdKey]).value;
  return (
    <>
      <Card
        title={
          t('in-service-levels:general.select') + t('in-service-levels:general.entityTypes.label', { context: entity })
        }
        rightHeaderContent={<SearchInput query={query} onChange={q => setQuery(q)} />}
      >
        {entityList && (
          <Ul>
            {entityList
              .filter(({ label }) => label.includes(query))
              .map(({ label, id }) => {
                return (
                  <Li key={id}>
                    <Stack direction="horizontal">
                      <CheckboxFancy
                        asRadioButton
                        value={id}
                        onChange={e => {
                          onChange(e.target.value);
                        }}
                        checked={id === reslt}
                      />
                      {label}
                    </Stack>
                  </Li>
                );
              })}
          </Ul>
        )}
      </Card>
    </>
  );
}
