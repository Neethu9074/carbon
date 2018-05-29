import React from 'react';

import { applicationId as matrixApplicationId } from 'in-applications/navigation/matrix';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import Button from 'in-new-components/Button';
import SvgIcon from 'in-components/SvgIcon';

import locals from './ApplicationSwitcher.mless';

export default function ApplicationSwitcher({ applicationId, applications, viewPath, refSetter, close }) {
  return (
    <div ref={refSetter} onMouseLeave={close}>
      <div className={locals.header}>
        <SvgIcon className={locals.headingIcon} type="lib_application_invert" width={40} height={40} />
        You are looking at this Service in<br />context of an Application
      </div>

      <div className={locals.content}>
        {applications.data.items
          .filter(item => item.application.id === applicationId)
          .map(item => <SelectedItem key={item.application.id} item={item} />)}
        <p className={locals.subSectionHeading}>Change application context:</p>
        <ul className={locals.menu}>
          {applications.data.items.filter(item => item.application.id !== applicationId).map(item => {
            return (
              <li key={item.application.id} className={locals.row}>
                <Button
                  className={locals.button}
                  kind="subtle"
                  href$={getModifiedUrlStream(params =>
                    setOrDeleteMatrixKey(params, viewPath, matrixApplicationId, item.application.id)
                  )}
                  icon="lib_application"
                >
                  {item.application.label}
                </Button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function SelectedItem({ item }) {
  return (
    <div className={locals.selectedItem}>
      <div className={locals.selectedItemLabelWrapper}>
        <SvgIcon type="lib_application" className={locals.icon} width={24} height={24} />
        {item.application.label}
      </div>
      <SvgIcon type="lib_uncheck" className={locals.checkIcon} width={24} height={24} />
    </div>
  );
}
