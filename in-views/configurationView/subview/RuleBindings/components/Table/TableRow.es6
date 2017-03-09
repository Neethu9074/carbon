import React from 'react';

import ModificationSaveStatus from 'in-components/form/ModificationSaveStatus';
import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import {getRuleBindingLink} from 'in-stores/navigation/configuration';
import {formatDurationAccurately} from 'in-services/formatters/date';
import {setActiveDialog} from 'in-components/DialogPresenter/store';
import {evaluateClassNames} from 'in-services/util/classnames';
import {formatDateTime} from 'in-services/formatters/date';
import Toggle from 'in-components/form/Toggle';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

import './TableRow.less';


const block = 'in-rule-bindings-table-row';

export const TableRow = connectTo(props => {
  return {
    href: getRuleBindingLink(props.ruleBinding.get('id'))
  };
},
function TableRow({ruleBinding, isSelected, onClick, onDeleteRuleBinding, setEnabled, status, href}) {
  return (
    <li className={block}
        onClick={() => onClick(ruleBinding)}>
      <div className={evaluateClassNames({
             [`${block}__row`]: true,
             [`${block}__row--selected`]: isSelected
           })}>
        <Column>
          <a href={href}>
            {ruleBinding.get('text')}
          </a>
        </Column>

        <Column>
          <Toggle className={`${block}__toggle`}
                  checked={ruleBinding.get('enabled', false)}
                  onChange={e => setEnabled(ruleBinding, e.target.checked)} />

          <ModificationSaveStatus status={status}
                                  className={`${block}__save-status`}
                                  reserveSpace />
        </Column>

        <Column>
          <Button className={`${block}__button`}
                  size='sm'
                  kind='danger'
                  onClick={() => setActiveDialog(
                    <ConfirmationDialog header='Confirm removal'
                                        description={
                                          <span>
                                            Are you sure you want to remove the ruleBinding?
                                          </span>
                                        }
                                        bButtonLabel='Remove ruleBinding'
                                        onB={() => onDeleteRuleBinding(ruleBinding.get('id'))} />
                  )}>
            Delete
          </Button >
        </Column>
      </div>

      {isSelected ?<Details ruleBinding={ruleBinding} /> : null}
    </li>
  );
});

function Column({children}) {
  return (
    <div className={`${block}__column`}>
      {children}
    </div>
  );
}

export function TableRowWrapper({children}) {
  return (
    <ul className={`${block}__wrapper`}>
      {children}
    </ul>
  );
}

function Details({ruleBinding}) {
  return (
    <div className={`${block}__details-wrapper`}>
      <DescriptionList>
        <DescriptionItem title='Text'>
          {ruleBinding.get('text')}
        </DescriptionItem>
        <DescriptionItem title='Description'>
          {ruleBinding.get('description')}
        </DescriptionItem>
        <DescriptionItem title='Expiration time'>
          {formatDurationAccurately(ruleBinding.get('expirationTime'), 1000)}
        </DescriptionItem>
        <DescriptionItem title='Severity'
                         className={`${block}__severity`}>
          {mapSeverityToLabel(ruleBinding.get('severity'))}
        </DescriptionItem>
        <DescriptionItem title='Triggering'>
          {ruleBinding.get('triggering') ? 'true' : 'false'}
        </DescriptionItem>
        <DescriptionItem title='Bounded rule'>
          {ruleBinding.getIn(['ruleIds', 0], '')}
        </DescriptionItem>
        <DescriptionItem title='Applied on filter query'>
          {ruleBinding.get('query', '')}
        </DescriptionItem>

        <DescriptionItem title='Last update'>
          {formatDateTime(ruleBinding.get('lastUpdated'))}
        </DescriptionItem>
      </DescriptionList>
    </div>
  );
}

function mapSeverityToLabel(severity) {
  if (severity === 0) {
    return 'change';
  } else if (severity === 5) {
    return 'warning';
  } else {
    return 'critical';
  }
}
