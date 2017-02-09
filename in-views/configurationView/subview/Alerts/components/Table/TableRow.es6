import React from 'react';

import AddAlertDialog from 'in-views/configurationView/subview/Alerts/AddAlertDialog';
import {addOrUpdateAlert} from 'in-services/groundskeeper/alertings';
import {setActiveDialog} from 'in-components/DialogPresenter/store';
import Toggle from 'in-components/form/Toggle';
import Button from 'in-components/Button';

import './TableRow.less';


const block = 'in-table-row';

export function TableRow({data}) {
  const alertId = data.get('id');

  return (
    <li className={block}>
      <Row>
        {alertId}
      </Row>

      <Row>
        {data.get('name')}
      </Row>

      <Row>
        <Toggle className={`${block}__toggle`}
                checked={data.get('enabled', false)}
                onChange={e => addOrUpdateAlert(data.set('enabled', e.target.checked))} />
      </Row>

      <Row>
        {data.get('misc')}
      </Row>

      <Row>
        <Button className={`${block}__button`}
                size='sm'
                kind='success'
                onClick={() => setActiveDialog(<AddAlertDialog alert={data} />)}>
          Edit
        </Button >
      </Row>

      <Row>
        <Button className={`${block}__button`}
                size='sm'
                kind='danger'>
          Remove
        </Button >
      </Row>
    </li>
  );
}

function Row({children}) {
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
