/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm } from 'formalistic';
import React from 'react';

import { themes } from '@instana/design-tokens';
import { SvgIcon } from '@instana/components';
import { Link } from '@instana/components';
import { Action } from '@instana/types';

import { isDocLink, isManual, getDocLinkFromFields } from 'in-automation/ActionCatalog/shared';
import RunActionDialog from 'in-automation/RunActionDialog/RunActionDialog';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { SetFormFunction } from 'in-settings/hooks/useEntityForm';
import IconButton from 'in-components/IconButton/IconButton';
import Tooltip from 'in-components/Tooltip/Tooltip';
import { NewAction } from 'in-automation/api';
import { t } from 'in-i18n';

import locals from './TestActionButton.mless';

interface TestActionButtonProps {
  action: NewAction | Action;
  form?: MapForm<any>;
  setForm?: SetFormFunction;
}
export default function TestActionButton({ action, form, setForm }: TestActionButtonProps) {
  const idValue = 'id' in action ? action.id : '';
  return (
    <>
      {!isDocLink(action.type) && !isManual(action.type) && (
        <Tooltip content={t('in-automation:ActionCatalog.test')} delay={500}>
          <IconButton
            id={`test_${idValue}`}
            kind="primaryv2"
            buttonType="button"
            type={'lib_actions_play'}
            onClick={() => {
              if (form && setForm && !form!.hierarchyValid) {
                setForm(form.setTouched(true, { recurse: true }));
                return;
              }
              addActiveDialog(<RunActionDialog test action={action as Action} volatileId={{}} />);
            }}
          />
        </Tooltip>
      )}
      {isDocLink(action.type) && (
        <Tooltip content={t('in-automation:ActionCatalog.test')} delay={500}>
          <Link
            className={locals.testDocLink}
            external
            onClick={() => {
              if (form && setForm && !form!.hierarchyValid) {
                setForm(form.setTouched(true, { recurse: true }));
                return;
              }
            }}
            href={getDocLinkFromFields(action.fields).value}
          >
            {' '}
            <SvgIcon type="lib_actions_play" color={themes.default.ids.color.option.blue['400']} />
          </Link>
        </Tooltip>
      )}
    </>
  );
}
