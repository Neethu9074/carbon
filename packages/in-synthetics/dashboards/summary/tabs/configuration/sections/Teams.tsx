/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { SyntheticTest } from '@instana/types/typeDefinitions';
import { t } from '@instana/i18n-react';

import ExpandableLightCard from 'in-alerting/components/ExpandableLightCard/ExpandableLightCard';
import TagsInTable from 'in-settings/tabs/GlobalSettings/components/TagsInTable';

import locals from 'in-synthetics/dashboards/summary/tabs/configuration/Configuration.mless';

interface Props {
  test: SyntheticTest;
}

const Teams = ({ test }: Props) => {
  return (
    <ExpandableLightCard
      className={locals.expandableCard}
      title={t('in-synthetics:dashboard.configuration.teams')}
      darkFrame
      useMaxAvailableHeight
      openByDefault
    >
      {test?.rbacTags && <TagsInTable tags={test.rbacTags} />}
    </ExpandableLightCard>
  );
};

export default Teams;
