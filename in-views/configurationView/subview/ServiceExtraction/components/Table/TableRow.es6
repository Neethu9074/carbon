import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import ModificationSaveStatus from 'in-components/form/ModificationSaveStatus';
import { getServiceRuleConfigLink } from 'in-stores/navigation/configuration';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import { setActiveDialog } from 'in-components/DialogPresenter/store';
import { evaluateClassNames } from 'in-services/util/classnames';
import Toggle from 'in-components/form/Toggle';
import SvgIcon from 'in-components/SvgIcon';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

import './TableRow.less';

const block = 'in-service-extraction-table-row';

export const TableRow = connectTo(
  props => {
    return {
      href: getServiceRuleConfigLink(props.rule.get('id'), props.ruleType)
    };
  },
  function TableRow({ rule, moveUp, moveDown, isSelected, onClick, onDeleteService, setEnabled, status, href }) {
    const ruleId = rule.get('id');
    const name = rule.get('name');

    return (
      <li className={block}>
        <div
          className={evaluateClassNames({
            [`${block}__row`]: true,
            [`${block}__row--selected`]: isSelected
          })}
        >
          <Column>
            <SvgIcon
              onClick={() => onClick(rule)}
              className={`${block}__order-up`}
              type={`${isSelected ? 'timeline_close' : 'timeline_open'}`}
              width={12}
              color="#172429"
            />
          </Column>

          <Column>
            <a href={href}>
              {name}
            </a>
          </Column>

          <Column>
            <SvgIcon
              className={`${block}__order-up`}
              type="chevron_up"
              width={12}
              color="#172429"
              onClick={() => moveUp(rule)}
            />
            <SvgIcon
              className={`${block}__order-down`}
              type="chevron_down"
              width={12}
              color="#172429"
              onClick={() => moveDown(rule)}
            />
          </Column>

          <Column>
            <Toggle
              className={`${block}__toggle`}
              checked={rule.get('enabled', false)}
              onChange={e => setEnabled(rule, e.target.checked)}
            />

            <ModificationSaveStatus status={status} className={`${block}__save-status`} reserveSpace />
          </Column>

          <Column>
            <Button
              size="sm"
              kind="danger"
              onClick={() =>
                setActiveDialog(
                  <ConfirmationDialog
                    header="Confirm removal"
                    description={
                      <span>
                        Are you sure you want to remove the rule <strong>{name}</strong>?
                      </span>
                    }
                    bButtonLabel="Remove rule"
                    onB={() => onDeleteService(ruleId)}
                  />
                )}
            >
              Delete
            </Button>
          </Column>
        </div>

        {isSelected ? <Details rule={rule} /> : null}
      </li>
    );
  }
);

function Column({ children }) {
  return (
    <div className={`${block}__column`}>
      {children}
    </div>
  );
}

export function TableRowWrapper({ children }) {
  return (
    <ul className={`${block}__wrapper`}>
      {children}
    </ul>
  );
}

function Details({ rule }) {
  return (
    <div className={`${block}__details-wrapper`}>
      <DescriptionList>
        <DescriptionItem title="comment">
          {rule.get('comment')}
        </DescriptionItem>
        <DescriptionItem title="match specification path">
          {rule.getIn(['matchSpecification', 'path'])}
        </DescriptionItem>
        <DescriptionItem title="match specification host">
          {rule.getIn(['matchSpecification', 'host'])}
        </DescriptionItem>
        <DescriptionItem title="extract specification label">
          {rule.getIn(['extractSpecification', 'label'])}
        </DescriptionItem>
      </DescriptionList>
    </div>
  );
}
