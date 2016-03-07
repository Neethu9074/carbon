import {Table, Column, Cell} from 'fixed-data-table';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import './Table.less';


const rpt = React.PropTypes;
const block = 'in-table';

export default React.createClass({

  displayName: 'Table',

  propTypes: {
    headerDefinitions: rpt.array.isRequired,
    data: irpt.list.isRequired,
    cellClicked: rpt.func
  },

  render() {
    const headerDefinitions = this.props.headerDefinitions;
    const fullWidth = headerDefinitions.map(h => h.size).reduce((a, b) => a + b, 0);
    const data = this.props.data;

    return (
      <div className={block}>
        <Table rowHeight={40}
               headerHeight={40}
               rowsCount={data.size}
               width={fullWidth}
               height={400}
               onRowClick={this.props.cellClicked}>

          {headerDefinitions.map(header =>
            <Column key={header.name}
                    header={<Cell>{header.name}</Cell>}
              cell={props => (

                <Cell {...props}
                      className={block + '__row'}>

                  {data.getIn([props.rowIndex, header.name])}

                </Cell>

              )}
              width={header.size}
            />
          )}
        </Table>
      </div>
    );
  }
});
