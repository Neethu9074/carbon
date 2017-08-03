import React from 'react';

// import Breadcrumb from 'in-sdk/components/dashboard/SwitchableView/components/Breadcrumb';
import LoadingIndicator from 'in-components/LoadingIndicator';
// import { translateBreadcrumbStructure } from 'in-services/breadcrumbs';
// import SvgIcon from 'in-components/SvgIcon';
import './SwitchableViewHeader.less';

const block = 'in-switchable-view-header';
const container = `${block}__container`;
//const chevron = `${block}__chevron`;

export default function SwitchableViewHeader({ snapshot /*, navigationParams, navigation*/ }) {
  if (!snapshot) {
    return (
      <header className={block}>
        <LoadingIndicator
          type="light"
          inline
          style={{
            height: '13px'
          }}
        />
      </header>
    );
  }

  // const currentPathName = navigationParams.pathname;

  // const translatedBreadcrumbStructure = translateBreadcrumbStructure(navigation, currentPathName, snapshot);
  /*
  const breadcrumbs = translatedBreadcrumbStructure
    .map(config => {
      return (
        <Breadcrumb
          key={config.path}
          config={config}
          isActive={currentPathName === config.path}
          navigationParams={navigationParams}
        />
      );
    })
    .reduce((prev, curr) => [
      prev,
      <span className={chevron}><SvgIcon type="chevron_right" height={9} color="#E2E9EC" /></span>,
      curr
    ]);
*/
  return (
    <header className={block}>
      <div className={container}>
        NONE
      </div>
    </header>
  );
}
