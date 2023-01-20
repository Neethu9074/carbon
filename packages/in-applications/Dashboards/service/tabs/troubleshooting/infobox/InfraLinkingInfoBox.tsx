/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import React from 'react';

import { t, Trans } from '@instana/i18n-react';

// @ts-expect-error
import ExpandableCard from 'in-components/AnalyzeView/FacetedFilters/ExpandableCardWithSubtitle';
import { infraLinkingColorMap, infraLinkingColorMapper } from '../metricConfigs';
import ColorIndicator, { getColorForValue } from './ColorIndicator';

import locals from './Infobox.mless';

const partialInfraLinking = Object.keys(infraLinkingColorMap).filter(
  (key: string) => key.startsWith('PARTIAL') || key === 'NONE_AMBIGUOUS_INFRA_REF'
);
const noInfraLinking = Object.keys(infraLinkingColorMap).filter((key: string) => key === 'NONE');

export default function InfraLinkingInfoBox() {
  return (
    <ExpandableCard
      title={t('in-applications:serviceTroubleshooting.troubleShootingExplanation')}
      className={locals.marginTop}
    >
      <p>{t('in-applications:serviceTroubleshooting.infraLinkingProblemStatement')}</p>
      <p>
        <Trans i18nKey={'in-applications:serviceTroubleshooting.problem'} components={{ bold: <strong /> }} />
      </p>
      <ul>
        {partialInfraLinking.map((partialResult, idx) => {
          return (
            <li key={`${idx}_${partialResult}`}>
              <div>
                <ColorIndicator color={getColorForValue(infraLinkingColorMapper('', partialResult))} shape={'dot'} />
                <strong>{partialResult}</strong>
              </div>
            </li>
          );
        })}
      </ul>
      <p>
        <Trans i18nKey={'in-applications:serviceTroubleshooting.possibleProblem'} components={{ bold: <strong /> }} />
      </p>
      <ul>
        {noInfraLinking.map((partialResult, idx) => {
          return (
            <li key={`${idx}_${partialResult}`}>
              <div>
                <ColorIndicator color={getColorForValue(infraLinkingColorMapper('', partialResult))} shape={'dot'} />{' '}
                <strong>{partialResult}</strong>
              </div>
            </li>
          );
        })}
      </ul>
      <p>{t('in-applications:serviceTroubleshooting.infraLinkingDocumentation')} InfrastructureDetectionDetail.java</p>
    </ExpandableCard>
  );
}
