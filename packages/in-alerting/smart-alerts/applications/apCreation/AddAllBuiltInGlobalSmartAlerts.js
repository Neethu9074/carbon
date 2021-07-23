/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { useObservable } from '@instana/hooks';
import { Link } from '@instana/components';

import { getAllBuiltInGlobalSmartAlerts } from 'in-alerting/smart-alerts/applications/api/globalApplicationAlertConfigs';
import { categoryGlobal } from 'in-alerting/smart-alerts/applications/components/list/constants';
import LabelText from 'in-alerting/smart-alerts/applications/apCreation/LabelText';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { alertsCategory } from 'in-applications/navigation/matrix';
import Sections from 'in-components/workspace/Sections/Sections';
import { alertsList } from 'in-applications/navigation/paths';
import CheckboxFancy from 'in-components/form/CheckboxFancy';
import { t } from 'in-i18n';

import locals from './AddAllBuiltInGlobalSmartAlerts.mless';

export default function AddAllBuiltInGlobalSmartAlerts({
  onChange,
  getBuiltInAlerts = getAllBuiltInGlobalSmartAlerts({ asObservable: false })
}) {
  const [checked, setChecked] = useState(false);
  const builtInAlerts = useObservable(getBuiltInAlerts, []);

  return (
    <Sections className={locals.container}>
      <CheckboxFancy
        label={<Headline builtInAlerts={builtInAlerts} />}
        explanation={<Explanation />}
        checked={checked}
        onChange={({ target }) => {
          setChecked(target.checked);
          onChange(target.checked ? builtInAlerts.map(({ id }) => id) : []);
        }}
        size="large"
      />
    </Sections>
  );
}

function Headline({ builtInAlerts = [] }) {
  const numAlerts = builtInAlerts.length;
  const numDisabled = builtInAlerts.filter(({ enabled }) => !enabled).length;

  return (
    <LabelText>
      {t('in-alerting:smartAlerts.applications.apCreation.addToAllBuiltInAlerts', { numAlerts })}{' '}
      <LabelText asSubText>
        {t('in-alerting:smartAlerts.applications.apCreation.addToAllBuiltInAlertsSubText', { numDisabled, numAlerts })}
      </LabelText>
    </LabelText>
  );
}

function Explanation() {
  return (
    <LabelText asSubText>
      {t('in-alerting:smartAlerts.applications.apCreation.addToAllExplanation')}{' '}
      <Link
        href$={getModifiedUrlStream(_location => {
          _location.pathname = alertsList;
          setOrDeleteMatrixKey(_location, alertsList, alertsCategory, categoryGlobal);
          return _location;
        })}
        external
      >
        {t('in-alerting:smartAlerts.applications.apCreation.addToAllExplanationSubText')}
      </Link>
    </LabelText>
  );
}

AddAllBuiltInGlobalSmartAlerts.propTypes = {
  /**
   * Returns selected alert ids
   */
  onChange: PropTypes.func.isRequired,
  /**
   * Endpoint
   */
  getBuiltInAlerts: PropTypes.func
};
