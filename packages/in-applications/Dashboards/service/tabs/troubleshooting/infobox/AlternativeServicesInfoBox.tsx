/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import React from 'react';

import { t, Trans } from '@instana/i18n-react';

// @ts-expect-error
import ExpandableCard from 'in-components/AnalyzeView/FacetedFilters/ExpandableCardWithSubtitle';

import locals from './Infobox.mless';

export default function AlternativeServicesInfoBox() {
  return (
    <ExpandableCard
      title={t('in-applications:serviceTroubleshooting.troubleShootingExplanation')}
      className={locals.marginTop}
    >
      <p>
        <Trans
          i18nKey={'in-applications:serviceTroubleshooting.alternativeServicesProblemStatement'}
          components={{ bold: <strong /> }}
        />
      </p>
      <p>
        <Trans
          i18nKey={'in-applications:serviceTroubleshooting.alternativeServicesExplanation'}
          components={{ bold: <strong />, code: <code />, br: <br /> }}
        />
      </p>
      <p>
        <Trans
          i18nKey={'in-applications:serviceTroubleshooting.alternativeServicesOk'}
          components={{ bold: <strong />, code: <code />, br: <br /> }}
        />
      </p>
      <ul>
        <li>
          <Trans
            i18nKey={'in-applications:serviceTroubleshooting.alternativeServicesProblem'}
            components={{ bold: <strong />, code: <code />, br: <br /> }}
          />
        </li>
        <li>
          <Trans
            i18nKey={'in-applications:serviceTroubleshooting.alternativeServicesPossibleProblem'}
            components={{ bold: <strong />, code: <code />, br: <br /> }}
          />
        </li>
      </ul>
    </ExpandableCard>
  );
}
