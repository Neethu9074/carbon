/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useCallback, useState, useRef, useEffect } from 'react';

import { HorizontalIndicator, Button } from '@instana/components';
import { Disposable } from '@instana/observables';

import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter/ErroneousResultPresenter';
import { FormModelElement, joinExpressions } from 'in-components/QueryBuilder/transformation/formModel';
import DescriptionText from 'in-components/form/DescriptionText/DescriptionText';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
// @ts-ignore
import * as entityUtils from 'in-services/entityUtils';
import { useEumTracker } from 'in-eum/tracking/segTracker';
import { Error, Nullish, Progress } from 'in-types';
import http from 'in-services/http';
import { t } from 'in-i18n';

interface AnalyzeImpactedUsersButtonProps {
  entityType?: string | unknown;
  eventId?: string;
  disabled?: boolean;
}

interface ImpactedBeaconTagFilterExpressionProps {
  alertId?: string | Nullish;
  entityId?: string;
  entityType?: string | unknown;
  excludeViolationRelatedFilters?: boolean;
}

export default function AnalyzeImpactedUsersButton({ entityType, eventId, disabled }: AnalyzeImpactedUsersButtonProps) {
  const [progress, setProgress] = useState<Progress | null>(null);
  const [errors, setErrors] = useState<Array<Error>>([]);
  const subscriptionRef = useRef<Disposable | null>(null);
  const { applicationsEumImpactedUsers } = useEumTracker();

  useEffect(
    () => () => {
      subscriptionRef.current?.dispose();
      subscriptionRef.current = null;
    },
    []
  );

  const onClickDownload = useCallback(() => {
    if (
      !entityUtils.isWebsiteEntityType(entityType) &&
      !entityUtils.isMobileAppEntityType(entityType) &&
      !entityUtils.isApplicationEntity(entityType)
    ) {
      setErrors([
        {
          message: 'Source of event should be Application, Website or MobileApp.',
          code: 'NOT_FOUND'
        }
      ]);
      setProgress(null);
      return;
    }
    setProgress({ loading: true });
    setErrors([]);
    return http<string>({
      method: 'GET',
      maxRetries: 3,
      url: `/api/eum/impact/report/${eventId}`,
      headers: getCsrfHeader()
    }).subscribe(
      blobResponse => {
        const blob = new Blob([blobResponse.body], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `impacted-users-${eventId}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        setProgress(null);
      },
      err => {
        setProgress(null);
        setErrors([err]);
      }
    );
  }, [entityType, eventId]);

  return (
    <>
      {progress?.loading && <HorizontalIndicator progress={progress} />}
      <Button
        kind="primary"
        icon="lib_actions_download"
        onClick={e => {
          e.stopPropagation();
          onClickDownload();
          applicationsEumImpactedUsers();
        }}
        disabled={disabled || progress?.loading}
      >
        {t('in-eum:generateImpactReport.button')}
      </Button>
      {!!errors.length && (
        <DescriptionText>
          <ErroneousResultPresenter errors={errors} />
        </DescriptionText>
      )}
    </>
  );
}

export function getEnrichedAnalyzeTagFilterFormModelImpactedBeacons({
  alertId,
  entityId,
  entityType,
  excludeViolationRelatedFilters
}: ImpactedBeaconTagFilterExpressionProps) {
  const tagFilterName = excludeViolationRelatedFilters
    ? entityUtils.isMobileAppEntityType(entityType)
      ? 'mobileBeacon.mobileApp.id'
      : 'beacon.website.id'
    : 'impactedBeacon.websiteOrMobileApp.id';

  const eumAlertId = excludeViolationRelatedFilters ? null : alertId;

  return joinExpressions({
    expressions: [
      eumAlertId ? tagFilter('impactedBeacon.alertId', EQUALS, eumAlertId) : null,
      entityId ? tagFilter(tagFilterName, EQUALS, entityId) : null
    ].filter(Boolean) as (FormModelElement | FormModelElement[])[]
  });
}
