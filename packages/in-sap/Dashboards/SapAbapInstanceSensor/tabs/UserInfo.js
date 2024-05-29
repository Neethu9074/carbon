/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';

import UserLogonTypeStatus from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/UserLogonTypeStatus.js';
import TimeOfLastUpdateCardTitle from 'in-sdk/components/dashboard/TimeOfLastUpdateCardTitle';
import Table from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/Table';
import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import { number } from 'in-services/formatters/number';
import { shorten } from 'in-services/util/string';
import ComboBox from 'in-components/ComboBox';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

import Polocals from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/ComboBox.mless';
import locals from './RawTableFormat.mless';

const cols = [
  {
    title: t('in-sap:dashboards.client'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.userDetail.get('MANDT');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:dashboards.userName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.userDetail.get('BNAME');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:dashboards.tID'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.userDetail.get('TID');
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-sap:dashboards.tCode'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.userDetail.get('TCODE');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:dashboards.terminalID'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.userDetail.get('TERM');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:dashboards.hostAddress'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.userDetail.get('HOSTADDR');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:dashboards.logonType'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.userDetail.get('TYPE');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:dashboards.dialogTime'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return formatTime(row.userDetail.get('ZEIT'));
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  }
];

export default connectTo(
  props => {
    return {
      data: getRawPayloadWithTimestamp(props.snapshotId, 'userInfo')
    };
  },

  function UserInfo({ data }) {
    const [{ logonType }, setPhase] = useState(UserLogonTypeStatus);

    const rightHeader = (
      <ComboBox
        placeholder={t('in-sap:dashboards.logonType')}
        isSearchable={false}
        value={logonType}
        className={Polocals.filter}
        // @ts-expect-error Module needs to be translated to TS
        onChange={t => setPhase({ logonType: t ? t.value : null })}
        options={UserLogonTypeStatus}
      />
    );

    if (!data || !data.get('raw_payload')) {
      return null;
    }
    const userDetails = data.get('raw_payload');
    if (userDetails.size === 0) {
      return null;
    }
    const rows = userDetails
      .toArray()
      .map((userDetail, idx) => {
        return {
          key: String(idx),
          userDetail
        };
      })
      .filter(function (rows) {
        if (logonType == null) {
          return rows;
        } else if (logonType == 'Others') {
          return (
            rows != null &&
            rows.userDetail.get('TYPE') != 'GUI' &&
            rows.userDetail.get('TYPE') != 'Internal RFC' &&
            rows.userDetail.get('TYPE') != 'External RFC' &&
            rows.userDetail.get('TYPE') != 'Daemon'
          );
        } else {
          return rows != null && rows.userDetail.get('TYPE') === logonType;
        }
      });
    return (
      <Table
        withoutPadding
        cardTitle={<TimeOfLastUpdateCardTitle title={t('in-sap:dashboards.userInfo')} />}
        cols={cols}
        rows={rows}
        initialSortColumn={0}
        initialSortDirection="asc"
        rightHeader={rightHeader}
      />
    );
  }
);

function Args({ args }) {
  return <code className={locals.statement}>{args}</code>;
}

function formatTime(timeString) {
  const hours = timeString.substring(0, 2);
  const minutes = timeString.substring(2, 4);
  const seconds = timeString.substring(4, 6);
  return `${hours}:${minutes}:${seconds}`;
}
