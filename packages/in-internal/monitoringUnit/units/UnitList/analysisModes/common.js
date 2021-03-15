/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { getModifiedUrlStream } from 'in-stores/navigation';
import Link from 'in-components/Link';
import { t } from 'in-i18n';

export const unitColumn = {
  id: 'unit',
  title: t('in-internal:monitoringUnit.units.common.unit'),
  type: 'string',
  typeArgs: {
    getValue(row) {
      return `${row.tenant}-${row.unit}`;
    },
    getContent(val, row) {
      return (
        <Link
          href$={getModifiedUrlStream(params => {
            params.pathname = '/internal/monitoringUnit/unit';
            setOrDeleteMatrixKey(params, '/unit', 'tenant', row.tenant);
            setOrDeleteMatrixKey(params, '/unit', 'unit', row.unit);
          })}
        >
          {val}
        </Link>
      );
    }
  }
};
