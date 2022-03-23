/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import React from 'react';

import { t, Trans } from '@instana/i18n-react';
import { Link } from '@instana/components';

// @ts-expect-error ExpandableCard is not yet converted to TS, nor does it provide types
import ExpandableCard from 'in-components/AnalyzeView/FacetedFilters/ExpandableCardWithSubtitle';
import { serviceMappingColorMap, serviceMappingColorMapper } from '../metricConfigs';
import ColorIndicator, { getColorForValue } from './ColorIndicator';

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
      <p>
        {t('in-applications:serviceTroubleshooting.serviceMappingDocumentation')}{' '}
        <Link
          href={
            'https://github.ibm.com/instana/backend/blob/0d2312cf884f9b55b110566947b14a8bddc581a9/appdata-processor/src/main/java/com/instana/spanprocessing/stream/mapping/cache/MappingOutcomeDetail.java#L10'
          }
        >
          MappingOutcomeDetail.java
        </Link>
      </p>
    </ExpandableCard>
  );
}
