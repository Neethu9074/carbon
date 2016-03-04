import {Table, Column, Cell} from 'fixed-data-table';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import './Table.less';


const block = 'in-table';

export default React.createClass({

  displayName: 'Table',

  propTypes: {
    headerDefinitions: React.PropTypes.array.isRequired,
    data: irpt.list.isRequired
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
               height={400}>

          {headerDefinitions.map(header =>
            <Column key={header.name}
                    header={<Cell>{header.name}</Cell>}
              cell={props => (
                <Cell {...props}>
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
