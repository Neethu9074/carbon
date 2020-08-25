import React from 'react';

import SliManageList from 'in-custom-dashboards/widgets/Slo/SliManageList';
import { getSliConfigurations } from './apiMock';
import { noop } from 'in-services/util/function';

export default {
  title: 'Templates|CustomDashboard/widgets/SLO/SLI-management',
  component: SliManageList
};

const all_services_mock = 'btg-B701Rx6o9QNXUS4TVw';

export function Default() {
  const apiMock = {
    getSliConfigurations: getSliConfigurations
  };
  return <SliManageList api={apiMock} applicationId={all_services_mock} setSlideInView={noop} />;
}
