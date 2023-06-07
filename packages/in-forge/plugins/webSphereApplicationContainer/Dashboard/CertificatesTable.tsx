/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { zeroDecimalPlaces } from 'in-services/formatters/number';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.webSphereAppContainer.titleKeystore'),
    type: 'string',
    typeArgs: {
      getValue(row: any) {
        return row.key.split('/')[0];
      }
    }
  },
  {
    title: t('in-forge:plugins.webSphereAppContainer.titleCertificateAlias'),
    type: 'string',
    typeArgs: {
      getValue(row: any) {
        const idx = row.key.indexOf("/");
        return row.key.substring(idx + 1);
      }
    }
  },
  {
    title: t('in-forge:plugins.webSphereAppContainer.titleCertificateOwner'),
    type: 'string',
    typeArgs: {
      getValue(row: any) {
        return row.snapshot.getIn(['data', 'certificates.' + row.key + '.owner']);
      }
    }
  },
  {
    title: t('in-forge:plugins.webSphereAppContainer.titleCertificateIssuer'),
    type: 'string',
    typeArgs: {
      getValue(row: any) {
        return row.snapshot.getIn(['data', 'certificates.' + row.key + '.issuer']);
      }
    }
  },
  {
    title: t('in-forge:plugins.webSphereAppContainer.titleCertificateSerial'),
    type: 'string',
    typeArgs: {
      getValue(row: any) {
        return row.snapshot.getIn(['data', 'certificates.' + row.key + '.serial']);
      }
    }
  },
  {
    title: t('in-forge:plugins.webSphereAppContainer.titleCertificateExp'),
    type: 'string',
    typeArgs: {
      getValue(row: any) {
        return row.snapshot.getIn(['data', 'certificates.' + row.key + '.expiration']);
      }
    }
  },
  {
    title: t('in-forge:plugins.webSphereAppContainer.titleCertificateDaystoExp'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: any) {
        return row.snapshot.get('id');
      },
      getMetricName(row: any) {
        return 'certificates.' + row.key + '.expDaysLeft';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function CertificatesTable({ snapshot }: { snapshot: SnapshotData }) {
  const timeConfig = useTimeConfig();
  const certificates = snapshot.getIn(['data', 'certificateNames'], emptyList);
  if (certificates.size === 0) {
    return null;
  }
  const rows = certificates.toArray().map((certificate: string) => {
    return {
      key: certificate,
      snapshot: snapshot,
      timeConfig
    };
  });

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.webSphereAppContainer.titleCertificatesCount', {
        len: rows.length
      })}
      cols={cols}
      rows={rows}
    />
  );
}
