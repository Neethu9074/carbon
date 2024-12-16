/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import { Button, PreviewPill } from '@instana/components';

import DangerousHtmlPresenter from 'in-components/DangerousHtmlPresenter';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/dialog/BlueprintDescription.mless';

export function BlueprintDescription({ config, selectButtonDisabled, isSimpleMode, onSelectBlueprint }) {
  return (
    <div className={locals.container}>
      <BlueprintText config={config} />
      {!isSimpleMode && (
        <Button
          kind={selectButtonDisabled ? 'info' : 'primary'}
          className={locals.button}
          disabled={selectButtonDisabled}
          onClick={() => onSelectBlueprint(config)}
        >
          {t('in-alerting:smartAlerts.components.smartAlertDialog.blueprintDescriptionButtonSelect')}
        </Button>
      )}
    </div>
  );
}

export function BlueprintText({ config }) {
  const { headline, text, isBeta } = config;

  return (
    <div>
      <div className={locals.headline}>
        <h3 className={locals.header}>{headline}</h3>
        {isBeta && <PreviewPill />}
      </div>
      <DangerousHtmlPresenter className={locals.text} html={text} />
    </div>
  );
}

BlueprintDescription.propTypes = {
  config: PropTypes.object.isRequired,
  selectButtonDisabled: PropTypes.bool,
  isSimpleMode: PropTypes.bool,
  onSelectBlueprint: PropTypes.func
};
