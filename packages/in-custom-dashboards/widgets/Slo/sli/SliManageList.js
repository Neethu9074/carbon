/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import { Message, Button } from '@instana/components';

import CreateSliFormFactory from 'in-custom-dashboards/widgets/Slo/sli/create/CreateSliFormFactory';
import { trackSliCreate, trackSliViewSLI } from 'in-custom-dashboards/widgets/Slo/tracker';
import SlideInView, { NoHeader } from 'in-components/SlideInView/SlideInView';
import { getSliConfigurationsByEntity } from 'in-custom-dashboards/api';
import SliList from 'in-custom-dashboards/widgets/Slo/sli/SliList';
import { isLoading, hasError } from 'in-services/util/result';
import { containsIgnoreCase } from 'in-services/util/string';
import { role } from 'in-stores/user';
import { Trans, t } from 'in-i18n';

import locals from './SliManageList.mless';

export default function SliManageList({ entityType, entityId, subSlideState }) {
  const [selectedSli, setSelectedSli] = subSlideState;
  const [nameQuery, setNameQuery] = useState('');
  const close = () => setSelectedSli(null);
  const { canConfigureServiceLevelIndicators } = role;

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
        onChange={setNameQuery}
        getItems={() => getSliConfigurationsByEntity({ entityType, entityId }).map(searchBySliName(nameQuery))}
        rightHeader={
          canConfigureServiceLevelIndicators && (
            <Button
              kind="action"
              onClick={() => {
                setSelectedSli({});
                trackSliCreate();
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
          setSelectedSli(sliConfig);
          trackSliViewSLI({ sliId: sliConfig.id, sliType: sliConfig.sliEntity?.sliType });
        }}
      />
    </div>
  );

  return (
    <SlideInView
      onShowSlideInContentChange={close}
      showSlideInContent={selectedSli}
      HeaderComponent={NoHeader}
      slideTransitionDurationMillis={500}
      slideInContentTitle={t('in-custom-dashboards:widgets.slo.sliManageList.sliList')}
      renderSlideInContent={setFooter => (
        <div className={locals.formWrapper}>
          <CreateSliFormFactory {...{ entityType, entityId, close, setFooter, sliConfig: selectedSli }} />
        </div>
      )}
      staticContent={sliManageListMain}
      enforceMaxHeightForStaticContent
    />
  );
}

function searchBySliName(query) {
  return sliConfigResult => {
    if (isLoading(sliConfigResult) || hasError(sliConfigResult)) {
      return sliConfigResult;
    }

    return {
      ...sliConfigResult,
      data: {
        items: sliConfigResult.data.filter(sli => containsIgnoreCase(sli.sliName, query))
      }
    };
  };
}
