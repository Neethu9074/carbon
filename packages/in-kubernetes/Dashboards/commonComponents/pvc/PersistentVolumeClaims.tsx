/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { Card, Stack, Ul, Li, KeyValue, SearchInput } from '@instana/components';
import { Error } from '@instana/types';

import exploreKubernetesPersistentVolumeClaims from 'in-kubernetes/subscriptions/exploreKubernetesPersistentVolumeClaims';
import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper';
import useCursorPagination from 'in-hooks/useCursorPagination';
import { isLoading } from 'in-services/util/result';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

import locals from 'in-kubernetes/Dashboards/commonComponents/pvc/PersistentVolumeClaims.mless';

interface Props {
  podUID?: string;
  workloadUID?: string;
}

export default function PersistentVolumeClaimsCard({ podUID, workloadUID }: Props) {
  const timeConfig = useTimeConfig();
  const retrievalSize = 20;
  const result = useCursorPagination(({ cursor }) =>
    exploreKubernetesPersistentVolumeClaims({
      query: { timeConfig, pagination: { cursor, retrievalSize }, search: '', facets: { podUID, workloadUID } }
    })
  );
  const loading = isLoading(result);

  return (
    <Card>
      <Stack>
        <HorizontalFlexWrapper className={locals.header}>
          <div />
          <SearchInput
            onChange={() => {}}
            inputClassName={locals.searchInput}
            placeholder={t('in-components:searchInput.placeholderSearch')}
          />
        </HorizontalFlexWrapper>
        <List firstViewing={loading} data={result?.items} errorMessage={result?.errors}>
          <Items name={''} persistentVolume={''} phase={''} requestSize={''} storageClass={''} />
        </List>
      </Stack>
    </Card>
  );
}

interface ItemsProps {
  name: string;
  persistentVolume: string;
  phase: string;
  storageClass: string;
  requestSize: string;
}

function Items(props: ItemsProps) {
  return (
    <>
      <KeyValue className={locals.name} label={'PVC'} value={props?.name} accentuated />
      <KeyValue className={locals.persistentVolume} label={'PV'} value={props?.persistentVolume} accentuated />
      <KeyValue className={locals.storageClass} label={'Storage Class'} value={props?.storageClass} accentuated />
      <KeyValue className={locals.requestSize} label={'Request Size'} value={props?.requestSize} accentuated />
      <KeyValue className={locals.phase} label={'Phase'} value={props?.phase} accentuated />
    </>
  );
}

interface ListProps {
  firstViewing: boolean;
  errorMessage?: Error[];
  data: any; // TODO: use proper interface.
  children: React.ReactElement;
}

function List({ firstViewing, errorMessage, data, children }: ListProps) {
  if (errorMessage != null && errorMessage.length > 0) {
    return <ErroneousResultPresenter errors={errorMessage} />;
  }
  if (firstViewing) {
    return <LoadingIndicator text={t('in-applications:loadingData')} height={100} size={'xxl'} />;
  }

  return (
    <Ul>
      {data.map((el: React.ReactElement, idx: number) => (
        <Li key={idx}>{React.Children.map(children, c => React.cloneElement(c, el))}</Li>
      ))}
    </Ul>
  );
}
