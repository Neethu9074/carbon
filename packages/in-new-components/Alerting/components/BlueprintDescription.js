/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import PropTypes from 'prop-types';
import React from 'react';

import DangerousHtmlPresenter from 'in-components/DangerousHtmlPresenter';
import Button from 'in-new-components/Button/Button';

import locals from './BlueprintDescription.mless';

export function BlueprintDescription({ config, selectButtonDisabled, isSimpleMode, onSelectBlueprint }) {
  const { headline, text } = config;

  return (
    <div className={locals.container}>
      <div>
        <h3 className={locals.headline}>{headline}</h3>
        <DangerousHtmlPresenter className={locals.text} html={text} />
      </div>
      {!isSimpleMode && (
        <Button
          kind={selectButtonDisabled ? 'info' : 'primary'}
          className={locals.button}
          disabled={selectButtonDisabled}
          onClick={() => onSelectBlueprint(config)}
        >
          Select
        </Button>
      )}
    </div>
  );
}

BlueprintDescription.propTypes = {
  config: PropTypes.object.isRequired,
  selectButtonDisabled: PropTypes.bool,
  isSimpleMode: PropTypes.bool,
  onSelectBlueprint: PropTypes.func
};
