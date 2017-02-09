import React from 'react';

import RemoveAlertDialog from 'in-views/configurationView/subview/Alerts/RemoveAlertDialog';
import AddAlertDialog from 'in-views/configurationView/subview/Alerts/AddAlertDialog';
import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import {addOrUpdateAlert} from 'in-services/groundskeeper/alertings';
import {setActiveDialog} from 'in-components/DialogPresenter/store';
import {evaluateClassNames} from 'in-services/util/classnames';
import Toggle from 'in-components/form/Toggle';
import Button from 'in-components/Button';

import './TableRow.less';


const block = 'in-table-row';

export function TableRow({data, isSelected, onClick}) {
  const alertId = data.get('id');

  return (
    <li className={block}
        onClick={() => onClick(data)}>
      <div className={evaluateClassNames({
             [`${block}__row`]: true,
             [`${block}__row--selected`]: isSelected
           })}>
        <Column>
          {alertId}
        </Column>

        <Column>
          {data.getIn(['data', 'name'])}
        </Column>

        <Column>
          <Toggle className={`${block}__toggle`}
                  checked={data.getIn(['data', 'enabled'], false)}
                  onChange={e => addOrUpdateAlert(data.setIn(['data', 'enabled'], e.target.checked))} />
        </Column>

        <Column>
          {data.getIn(['data', 'entityType'])}
        </Column>

        <Column>
          <Button className={`${block}__button`}
                  size='sm'
                  kind='success'
                  onClick={() => setActiveDialog(<AddAlertDialog alert={data} />)}>
            Edit
          </Button >
        </Column>

        <Column>
          <Button className={`${block}__button`}
                  size='sm'
                  kind='danger'
                  onClick={() => setActiveDialog(<RemoveAlertDialog alert={data} />)}>
            Remove
          </Button >
        </Column>
      </div>

      {isSelected ?
        <div className={`${block}__details-wrapper`}>
          <DescriptionList>
            <DescriptionItem title='Decription'>
              {data.getIn(['data', 'decription'])}
            </DescriptionItem>
            <DescriptionItem title='Severity'>
              {data.getIn(['data', 'severity'])}
            </DescriptionItem>
            <DescriptionItem title='Metric'>
              {data.getIn(['data', 'metricName'])}
            </DescriptionItem>
            <DescriptionItem title='Is Triggering'>
              {data.getIn(['data', 'isTriggering'])}
            </DescriptionItem>
            <DescriptionItem title='Condition'>
              {data.getIn(['data', 'condition'])}
            </DescriptionItem>
            <DescriptionItem title='Filter Query'>
              {data.getIn(['data', 'query'])}
            </DescriptionItem>
          </DescriptionList>
        </div>
      : null}
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
