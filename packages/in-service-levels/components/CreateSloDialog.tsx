/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';

import { Typography } from '@instana/components';

import SloEntityTypeSelector from 'in-service-levels/components/SloList/components/SloEntityTypeSelector';
import SloEntityTable from 'in-service-levels/components/SloList/components/SloEntityTable';
import ConfigDialog from 'in-service-levels/components/ConfigDialog';
import { close } from 'in-components/DialogPresenter/store';
import { NavItem } from 'in-components/SideNav/SideNav';
import { noop } from 'in-services/fixedObjects';
import { t } from 'in-i18n';

const entityType = 'application';
export default function CreateSloDialog() {
  const [value, setValue] = useState('None selected');
  const [selection, setSelection] = useState('None selected');
  const chooseValue = (values: React.SetStateAction<string>) => {
    setSelection(values);
  };
  const navItems: Array<NavItem> = [
    {
      scrollId: '1-select-entity',
      label: t('in-service-levels:createSloDialog.selectEntityNavItem'),
      title: t('in-service-levels:createSloDialog.selectEntityNavItem'),
      valid: true,
      content: (
        <>
          <Typography variant="heading-200" component="h2">
            {t('in-service-levels:createSloDialog.selectEntityTitle')}
          </Typography>
          <SloEntityTypeSelector
            value={entityType}
            onChange={e => {
              setSelection('None selected');
              setValue(e);
            }}
          />
          <Typography variant="heading-100" component="h3">
            {t('in-service-levels:general.selectLabel')}
            {selection}
          </Typography>
          {value === 'None selected' ? null : <SloEntityTable value={value} chooseValue={chooseValue} />}
        </>
      )
    }
  ];

  return (
    <ConfigDialog
      title={t('in-service-levels:createSloDialog.title')}
      navItems={navItems}
      onClose={close}
      onSave={noop}
      noHeader
      noDivider
    />
  );
}
