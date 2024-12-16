/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';

import { useObservable } from '@instana/hooks';
import { TimeConfig } from '@instana/types';

// @ts-expect-error needs TS migration
import { SnapshotData, getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import { typeMap, typeList } from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/UserLogonTypeStatus';
import Table from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/Table';
import { number } from 'in-services/formatters/number';
import ComboBox from 'in-components/ComboBox';
import { t } from 'in-i18n';

import Polocals from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/ComboBox.mless';

interface UserInfoRow {
  key: number;
  snapshotId: string;
  userInfoStats: Map<string, object>;
}
interface UserInfoProps {
  snapshotId: string;
  timeConfig: TimeConfig;
}

const cols = [
  {
    title: t('in-sap:dashboards.client'),
    type: 'string',
    typeArgs: {
      getValue(row: UserInfoRow) {
        return row.userInfoStats.get('MANDT');
      }
    }
  },
  {
    title: t('in-sap:dashboards.userName'),
    type: 'string',
    typeArgs: {
      getValue(row: UserInfoRow) {
        return row.userInfoStats.get('BNAME');
      }
    }
  },
  {
    title: t('in-sap:dashboards.tID'),
    type: 'number',
    typeArgs: {
      getValue(row: UserInfoRow) {
        return row.userInfoStats.get('TID');
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-sap:dashboards.tCode'),
    type: 'string',
    typeArgs: {
      getValue(row: UserInfoRow) {
        return row.userInfoStats.get('TCODE');
      }
    }
  },
  {
    title: t('in-sap:dashboards.terminalID'),
    type: 'string',
    typeArgs: {
      getValue(row: UserInfoRow) {
        return row.userInfoStats.get('TERM');
      }
    }
  },
  {
    title: t('in-sap:dashboards.hostAddress'),
    type: 'string',
    typeArgs: {
      getValue(row: UserInfoRow) {
        return row.userInfoStats.get('HOSTADDR');
      }
    }
  },
  {
    title: t('in-sap:dashboards.logonType'),
    type: 'string',
    typeArgs: {
      getValue(row: UserInfoRow) {
        return row.userInfoStats.get('TYPE');
      }
    }
  },
  {
    title: t('in-sap:dashboards.dialogTime'),
    type: 'string',
    typeArgs: {
      getValue(row: UserInfoRow) {
        return formatTime(row.userInfoStats.get('ZEIT'));
      }
    }
  }
];

export default function UserInfo({ snapshotId, timeConfig }: UserInfoProps) {
  const data = useObservable(() => getRawPayloadWithTimestamp(snapshotId, 'userInfo'), [snapshotId]);
  // @ts-expect-error Module needs to be translated to TS
  const [{ logonType }, setPhase] = useState(typeMap);
  const rightHeader = (
    <ComboBox
      placeholder={t('in-sap:dashboards.logonType')}
      isSearchable={false}
      value={logonType}
      className={Polocals.filter}
      // @ts-expect-error Module needs to be translated to TS
      onChange={t => setPhase({ logonType: t ? t.value : null })}
      options={typeMap}
    />
  );
  if (!data) {
    return null;
  }
  const userInfoStat = (data as SnapshotData).get('raw_payload', []);
  const rows: UserInfoRow[] = userInfoStat
    .keySeq()
    .toArray()
    .map((key: string) => {
      const userInfoStats = userInfoStat.get(key);
      return {
        key: String(key),
        snapshotId,
        timeConfig,
        userInfoStats
      };
    })
    .filter(function (rows: UserInfoRow) {
      if (logonType == null) {
        return rows;
      } else if (logonType == 'Others') {
        const type = rows.userInfoStats.get('TYPE');
        return rows != null && typeof type === 'string' && !typeList.includes(type);
      } else {
        return rows != null && rows.userInfoStats.get('TYPE') === logonType;
      }
    });
  return (
    <Table
      withoutPadding
      cardTitle={t('in-sap:dashboards.userLoginInfo')}
      cols={cols}
      rows={rows}
      initialSortColumn={0}
      initialSortDirection="asc"
      rightHeader={rightHeader}
    />
  );
}

function formatTime(timeString: any) {
  const hours = timeString.substring(0, 2);
  const minutes = timeString.substring(2, 4);
  const seconds = timeString.substring(4, 6);
  return `${hours}:${minutes}:${seconds}`;
}
