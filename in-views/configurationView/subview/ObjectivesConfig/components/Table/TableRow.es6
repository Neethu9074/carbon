import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import ModificationSaveStatus from 'in-components/form/ModificationSaveStatus';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import {setActiveDialog} from 'in-components/DialogPresenter/store';
import {evaluateClassNames} from 'in-services/util/classnames';
import {formatDateTime} from 'in-services/formatters/date';
import Toggle from 'in-components/form/Toggle';
import Button from 'in-components/Button';

import './TableRow.less';


const block = 'in-objectives-table-row';

export function TableRow({objective, isSelected, onClick, onDeleteObjective, setEnabled, status}) {
  const objectiveId = objective.get('id');
  const objectiveName = objective.get('name');

  return (
    <li className={block}
        onClick={() => onClick(objective)}>
      <div className={evaluateClassNames({
             [`${block}__row`]: true,
             [`${block}__row--selected`]: isSelected
           })}>
        <Column>
          {objectiveId}
        </Column>

        <Column>
          {objectiveName}
        </Column>

        <Column>
          <Toggle className={`${block}__toggle`}
                  checked={objective.get('enabled', false)}
                  onChange={e => setEnabled(objective, e.target.checked)} />

          <ModificationSaveStatus status={status}
                                  className={`${block}__save-status`}
                                  reserveSpace />
        </Column>

        <Column />

        <Column>
          <Button className={`${block}__button`}
                  size='sm'
                  kind='danger'
                  onClick={() => setActiveDialog(
                    <ConfirmationDialog header='Confirm removal'
                                        description={
                                          <span>
                                            Are you sure you want to remove the objective <strong>{objectiveName}</strong>?
                                          </span>
                                        }
                                        bButtonLabel='Remove objective'
                                        onB={() => onDeleteObjective(objectiveId)} />
                  )}>
            Remove
          </Button >
        </Column>
      </div>

      {isSelected ?<Details objective={objective} /> : null}
    </li>
  );
}

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

function Details({objective}) {
  const match = objective.get('match');
  const rule = objective.get('rule');

  return (
    <div className={`${block}__details-wrapper`}>
      <DescriptionList>
        <DescriptionItem title='Filtering Query'>
          {match.get('filteringQuery')}
        </DescriptionItem>
        <DescriptionItem title='Time Pattern'>
          {match.get('timePattern')}
        </DescriptionItem>

        <DescriptionItem title='Reduction Operation'>
          {rule.get('reductionOperation')}
        </DescriptionItem>
        <DescriptionItem title='Reduction Operation'>
          {rule.get('thresholds').map(threshold =>
            <div key={threshold}>
              {threshold}
            </div>
          )}
        </DescriptionItem>

        <DescriptionItem title='Last update'>
          {formatDateTime(objective.get('lastUpdated'))}
        </DescriptionItem>
      </DescriptionList>
    </div>
  );
}
