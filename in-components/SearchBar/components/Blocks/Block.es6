import React from 'react';

import TextContent from 'in-components/SearchBar/components/Blocks/TextContent';
import Operator from 'in-components/SearchBar/components/Blocks/Operator';
import SvgIcon from 'in-components/SvgIcon';

import './Block.less';


const block = 'in-search-block';

export default React.createClass({

  displayName: 'Block',

  getInitialState() {
    return {
      selectedBlockId: null
    };
  },

  render() {
    const {b, onDeleteBlock} = this.props;
    const textId = `${b.get('id')}__text`;
    const operatorId = `${b.get('id')}__operator`;

    return (
      <div className={block}>
        <div className={`${block}__content`}>
          <TextContent b={b}
                       isSelected={this.state.selectedBlockId === textId}
                       onClick={() => this.setState({ selectedBlockId: textId })} />
          <Operator b={b}
                    isSelected={this.state.selectedBlockId === operatorId}
                    onClick={() => this.setState({ selectedBlockId: this.state.selectedBlockId === operatorId ? null : operatorId })} />
        </div>

        <SvgIcon className={`${block}__delete-icon`}
                 type='x'
                 width={8}
                 color='#6B8088'
                 onClick={e => onDeleteBlock(e, b)} />
      </div>
    );
  }
});
