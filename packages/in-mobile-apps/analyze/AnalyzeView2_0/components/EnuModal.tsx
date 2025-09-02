/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Ul, Li, Typography, ColumnizedContent, Link } from '@instana/components';

import { useGetLinkToMobileApp } from 'in-mobile-apps/navigation/paths';
import { close } from 'in-components/DialogPresenter/store';
import Dialog from 'in-components/Dialog/Dialog';
import { t } from 'in-i18n';

import locals from './EnuModal.mless';

interface DialogProps {
  usedMb: string;
  mobileAppName: string;
  mobileAppId: string;
  sessionResponses: string[];
  beaconTimeStamp: number;
  getHrefToDetailId?: (detailId: { sessionId: string; beaconTimestamp: number }, groupLabel?: string) => string;
  groupLabel?: string;
}
export default function EnuModal({
  sessionResponses = [],
  mobileAppName,
  mobileAppId,
  usedMb,
  beaconTimeStamp,
  getHrefToDetailId,
  groupLabel
}: DialogProps) {
  const mobileAppLabel = [
    {
      id: 'labelText',
      width: '20rem',
      widthInAbsoluteUnit: true,
      getContent() {
        return (
          <Typography variant="body-regular">
            {t('in-mobile-apps:sessionView.tabsSumPerformanceBeacon.enuModalMobileAppName')}
          </Typography>
        );
      }
    },
    {
      id: 'mobileAppName',
      width: '20rem',
      getContent() {
        const linkToMobileAppHref = useGetLinkToMobileApp(mobileAppId);
        return (
          <Link
            href={linkToMobileAppHref}
            onClick={() => {
              close();
            }}
          >
            {mobileAppName}
          </Link>
        );
      }
    }
  ];

  const usedMbDetails = [
    {
      id: 'labelText',
      width: '20rem',
      widthInAbsoluteUnit: true,
      getContent() {
        return (
          <Typography variant="body-regular">
            {t('in-mobile-apps:sessionView.tabsSumPerformanceBeacon.enuModalUsedMb')}
          </Typography>
        );
      }
    },
    {
      id: 'usedMb',
      width: '20rem',
      getContent() {
        return <Typography variant="body-regular">{usedMb + ' mb'}</Typography>;
      }
    }
  ];

  const formatSessionId = (sessionId: string) => {
    return sessionId.replace(/"/g, '');
  };
  const enuSessionList = [
    {
      id: 'labelText',
      width: '20rem',
      widthInAbsoluteUnit: true,
      getContent() {
        return (
          <Typography variant="body-regular">
            {t('in-mobile-apps:sessionView.tabsSumPerformanceBeacon.enuModalAffectedSessions')}
          </Typography>
        );
      }
    },
    {
      id: 'enuAffectedSessions',
      width: '20rem',
      getContent() {
        return (
          <Typography variant="body-regular">
            {sessionResponses.map((session, index) => {
              const formattedSessionId = formatSessionId(session);

              return (
                <div key={index}>
                  <Link
                    href={
                      getHrefToDetailId
                        ? getHrefToDetailId(
                            {
                              sessionId: formattedSessionId,
                              beaconTimestamp: beaconTimeStamp
                            },
                            groupLabel
                          )
                        : '#'
                    }
                    onClick={() => {
                      close();
                    }}
                  >
                    {formattedSessionId}
                  </Link>
                  {index < sessionResponses.length - 1 ? ', ' : ''}
                </div>
              );
            })}
          </Typography>
        );
      }
    }
  ];

  return (
    <Dialog
      className={locals.dialog}
      title={t('in-mobile-apps:sessionView.tabsSumPerformanceBeacon.enuModalTitle')}
      onClose={close}
      doNotCloseOnOutsideClick
    >
      <Ul space="disabled">
        <Li size="compact">
          <ColumnizedContent columnDefinitions={mobileAppLabel} />
        </Li>
        <Li size="compact">
          <ColumnizedContent columnDefinitions={usedMbDetails} />
        </Li>
        <Li size="compact">
          <ColumnizedContent columnDefinitions={enuSessionList} />
        </Li>
      </Ul>
    </Dialog>
  );
}
