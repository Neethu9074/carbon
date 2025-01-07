/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import React from 'react';

import { t, Trans } from '@instana/i18n-react';

// @ts-expect-error ExpandableCard is not yet converted to TS, nor does it provide types
import ExpandableCard from 'in-components/AnalyzeView/FacetedFilters/ExpandableCardWithSubtitle';
import {
  serviceMappingColorMap,
  serviceMappingColorMapper
} from 'in-applications/Dashboards/service/tabs/troubleshooting/metricConfigs';
import ColorIndicator, {
  getColorForValue
} from 'in-applications/Dashboards/service/tabs/troubleshooting/infobox/ColorIndicator';

import locals from './Infobox.mless';

const resilientMapping = Object.keys(serviceMappingColorMap).filter((key: string) =>
  key.startsWith('RESILIENT_MAPPING')
);

export default function ServiceMappingInfoBox() {
  return (
    <ExpandableCard
      title={t('in-applications:serviceTroubleshooting.troubleShootingExplanation')}
      className={locals.marginTop}
    >
      <p>{t('in-applications:serviceTroubleshooting.serviceMappingProblemStatement')}</p>
      <p>
        <Trans i18nKey={'in-applications:serviceTroubleshooting.problem'} components={{ bold: <strong /> }} />
      </p>
      <ul>
        {resilientMapping.map((resilientMappingResult, idx) => {
          return (
            <li key={`${idx}_${resilientMappingResult}`}>
              <div>
                <ColorIndicator
                  color={getColorForValue(serviceMappingColorMapper('', resilientMappingResult))}
                  shape={'dot'}
                />
                <strong>{resilientMappingResult}</strong>
              </div>
            </li>
          );
        })}
      </ul>
      <p>{t('in-applications:serviceTroubleshooting.serviceMappingDocumentation')} MappingOutcomeDetail.java</p>
    </ExpandableCard>
  );
}
