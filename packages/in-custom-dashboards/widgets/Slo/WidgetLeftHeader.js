/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { SvgIcon } from '@instana/components';

import SloEntityInfo from 'in-custom-dashboards/widgets/Slo/SloEntityInfo';
import SliConfigInfo from 'in-custom-dashboards/widgets/Slo/SliConfigInfo';

export default function WidgetLeftHeader({ sliConfig, monitoredEntityType, monitoredEntity }) {
  if (!sliConfig || !monitoredEntity) {
    return <SvgIcon type="lib_actions_loading" spinning />;
  }

  return (
    <>
      <SloEntityInfo entityType={monitoredEntityType} entity={monitoredEntity} />
      <SliConfigInfo sliConfig={sliConfig} entityType={monitoredEntityType} />
    </>
  );
}
