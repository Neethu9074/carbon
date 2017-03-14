import React from 'react';

import RuleDetails from 'in-views/configurationView/subview/Rules/components/RuleDetails';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import {setActiveDialog} from 'in-components/DialogPresenter/store';
import {evaluateClassNames} from 'in-services/util/classnames';
import {getRuleLink} from 'in-stores/navigation/configuration';
import PluginIcon from 'in-components/PluginIcon';
import {getSingular} from 'in-sdk/pluginName';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

import './TableRow.less';


const block = 'in-rule-table-row';

export const TableRow = connectTo(props => {
  return {
    href: getRuleLink(props.rule.get('id'))
  };
},
function TableRow({rule, isSelected, onClick, onDeleteRule, href}) {
  return (
    <li className={block}
        onClick={() => onClick(rule)}>
      <div className={evaluateClassNames({
             [`${block}__row`]: true,
             [`${block}__row--selected`]: isSelected
           })}>
        <Column>
          <a href={href}>
            {rule.get('name')}
          </a>
        </Column>

        <Column>
          <PluginIcon className={`${block}__entity-icon`}
                      dimension={20}
                      color='#000'
                      plugin={rule.get('entityType')} />
          {getSingular(rule.get('entityType'))}
        </Column>

        <Column>
          <Button className={`${block}__button`}
                  size='sm'
                  kind='danger'
                  onClick={() => setActiveDialog(
                    <ConfirmationDialog header='Confirm removal'
                                        description={
                                          <span>
                                            Are you sure you want to remove the rule <strong>{rule.get('name')}</strong>?
                                          </span>
                                        }
                                        bButtonLabel='Remove rule'
                                        onB={() => onDeleteRule(rule.get('id'))} />
                  )}>
            Delete
          </Button >
        </Column>
      </div>

      {isSelected ?<RuleDetails rule={rule} /> : null}
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
