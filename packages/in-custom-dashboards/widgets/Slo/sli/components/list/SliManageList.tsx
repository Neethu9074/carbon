/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Dispatch, SetStateAction, useState } from 'react';

import { Message, Button } from '@instana/components';
import { useObservable } from '@instana/hooks';

import CreateSliFormFactory from 'in-custom-dashboards/widgets/Slo/sli/components/create/CreateSliFormFactory';
import { deleteSliConfiguration, getSliConfigurationsByEntity } from 'in-custom-dashboards/api';
import { trackSliCreate, trackSliViewSLI } from 'in-custom-dashboards/widgets/Slo/tracker';
import { SliConfigBySliType } from 'in-custom-dashboards/widgets/Slo/sli/sliTypes';
import SliList from 'in-custom-dashboards/widgets/Slo/sli/components/list/SliList';
import SlideInView, { NoHeader } from 'in-components/SlideInView/SlideInView';
import { PaginatedResult, Result, SliConfiguration, SliType } from 'in-types';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { isLoading, hasError } from 'in-services/util/result';
import { containsIgnoreCase } from 'in-services/util/string';
import { role } from 'in-stores/user';
import { Trans, t } from 'in-i18n';

import locals from 'in-custom-dashboards/widgets/Slo/sli/components/list/SliManageList.mless';

type SubSlideState<S extends Lowercase<SliType>> = [
  Partial<SliConfigBySliType<S>> | undefined,
  Dispatch<SetStateAction<Partial<SliConfigBySliType<S> | undefined>>>
];
interface SliManageListProps<S extends Lowercase<SliType>> {
  entityType: S;
  entityId: string;
  subSlideState: SubSlideState<S>;
}

export default function SliManageList<S extends Lowercase<SliType>>({
  entityType,
  entityId,
  subSlideState
}: SliManageListProps<S>) {
  const [selectedSli, setSelectedSli] = subSlideState;
  const [nameQuery, setNameQuery] = useState<string>('');
  const close = () => setSelectedSli(undefined);
  const sliResult = useObservable(
    () => getSliConfigurationsByEntity({ entityType, entityId }).map(searchBySliName(nameQuery)),
    [entityType, entityId, nameQuery]
  );

  const canConfigureServiceLevelIndicators = role?.canConfigureServiceLevelIndicators ?? false;

  const sliManageListMain = (
    <div>
      {!canConfigureServiceLevelIndicators && (
        <Message className={locals.message} withIcon>
          <Trans
            i18nKey="in-custom-dashboards:widgets.slo.sliManageList.configSrvLevelIndicatorsMsg"
            components={{ italic: <i />, bold: <strong /> }}
          />
        </Message>
      )}
      <SliList
        onChange={({ query }) => setNameQuery(query ?? '')}
        result={sliResult}
        rightHeader={
          canConfigureServiceLevelIndicators && (
            <Button
              kind="action"
              onClick={() => {
                setSelectedSli({});
                trackSliCreate({});
              }}
              icon="lib_openclose_add_circle_outline"
              className={locals.createButton}
            >
              {t('in-custom-dashboards:widgets.slo.sliManageList.createSli')}
            </Button>
          )
        }
        query={nameQuery}
        selectSli={sliConfig => {
          setSelectedSli(sliConfig as SliConfigBySliType<S>);
          trackSliViewSLI({ sliId: sliConfig.id, sliType: sliConfig.sliEntity?.sliType });
        }}
        onDelete={deleteSliConfig}
      />
    </div>
  );

  return (
    <SlideInView
      onShowSlideInContentChange={close}
      showSlideInContent={Boolean(selectedSli)}
      HeaderComponent={NoHeader}
      slideTransitionDurationMillis={500}
      slideInContentTitle={t('in-custom-dashboards:widgets.slo.sliManageList.sliList')}
      renderSlideInContent={setFooter => (
        <div className={locals.formWrapper}>
          <CreateSliFormFactory<S>
            entityType={entityType}
            entityId={entityId}
            close={close}
            setFooter={setFooter}
            sliConfig={selectedSli}
          />
        </div>
      )}
      staticContent={sliManageListMain}
      enforceMaxHeightForStaticContent
    />
  );
}

function searchBySliName(query: string): (r: Result<SliConfiguration[]>) => Result<PaginatedResult<SliConfiguration>> {
  return (sliConfigResult: Result<SliConfiguration[]>): Result<PaginatedResult<SliConfiguration>> => {
    if (isLoading(sliConfigResult) || hasError(sliConfigResult)) {
      return (sliConfigResult as unknown) as Result<PaginatedResult<SliConfiguration>>;
    }

    const filtered = sliConfigResult.data!.filter(sli => containsIgnoreCase(sli.sliName, query));
    return {
      ...sliConfigResult,
      data: {
        items: filtered,
        page: 1,
        pageSize: filtered.length,
        totalHits: filtered.length
      }
    };
  };
}

const deleteSliConfig = (id: string): void => {
  deleteSliConfiguration(id).once(
    () => {
      addMessage(
        {
          type: 'info',
          timeout: 2000,
          content: t('in-custom-dashboards:widgets.slo.sliList.sliConfigDeleted')
        },
        'custom-dashboard-info'
      );
    },
    () => {
      addMessage(
        {
          type: 'danger',
          timeout: 3000,
          content: t('in-custom-dashboards:widgets.slo.sliList.failedDelSli')
        },
        'custom-dashboard-error'
      );
    }
  );
};
