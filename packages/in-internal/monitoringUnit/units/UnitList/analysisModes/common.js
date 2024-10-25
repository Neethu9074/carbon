/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Link } from '@instana/components';

import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { t } from 'in-i18n';

function UnitLink({ val, row }) {
  const { createHref, location } = useNavigation();

  const getHref = () => {
    location.pathname = '/internal/monitoringUnit/unit';
    setOrDeleteMatrixKey(location, '/unit', 'tenant', row.tenant);
    setOrDeleteMatrixKey(location, '/unit', 'unit', row.unit);

    return createHref(location);
  };

  return <Link href={getHref()}>{val}</Link>;
}

export const unitColumn = {
  id: 'unit',
  title: t('in-internal:monitoringUnit.units.common.unit'),
  type: 'string',
  typeArgs: {
    getValue(row) {
      return `${row.tenant}-${row.unit}`;
    },
    getContent: (val, row) => <UnitLink val={val} row={row} />
  }
};
