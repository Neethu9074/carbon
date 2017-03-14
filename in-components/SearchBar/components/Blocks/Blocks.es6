import React from 'react';

import {blocks$, deleteBlock} from 'in-components/SearchBar/stores/blocks';
import Block from 'in-components/SearchBar/components/Blocks/Block';
import connectTo from 'in-hoc/connectTo';

import './Blocks.less';


const block = 'in-search-blocks';

export default connectTo({
  blocks: blocks$
},
function Blocks({blocks}) {

  return (
    <div className={block}>
      {blocks.map(b =>
        <Block key={b.get('id')}
               b={b}
               onDeleteBlock={onDeleteBlock} />
      )}
    </div>
  );
});

function onDeleteBlock(e, b) {
  e.preventDefault();
  deleteBlock(b.get('id'));
}
