import React from 'react';

import Breadcrumb from 'in-sdk/components/dashboard/SwitchableView/components/Breadcrumb';
import LoadingIndicator from 'in-components/LoadingIndicator';
import { translateContext } from 'in-services/breadcrumbs';
import SvgIcon from 'in-components/SvgIcon';
import './SwitchableViewHeader.less';

const block = 'in-switchable-view-header';
const container = `${block}__container`;
const chevron = `${block}__chevron`;

export default function SwitchableViewHeader({ snapshot, navigationParams, navigation }) {
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

  const currentPathName = navigationParams.pathname;

  const translatedContext = translateContext(navigation, currentPathName, snapshot);

  const breadcrumbs = translatedContext
    .map(ctx => {
      return <Breadcrumb key={ctx.path} context={ctx} navigationParams={navigationParams} />;
    })
    .reduce((prev, curr) => [
      prev,
      <span className={chevron}><SvgIcon type="chevron_right" height={9} color="#E2E9EC" /></span>,
      curr
    ]);

  return (
    <header className={block}>
      <div className={container}>
        {breadcrumbs}
      </div>
    </header>
  );
}
