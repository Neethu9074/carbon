import React from 'react';

import MenuHeading from 'in-components/SearchBar/components/MenuHeading';
import {fieldsCategorized} from 'in-stores/search/fields';
import {mutateQuery} from 'in-stores/search/query';
import SvgIcon from 'in-components/SvgIcon';

import './AvailableKeywords.less';

const block = 'in-search-available-keywords';
const listClassName = `${block}__list`;
const listItemClassName = `${block}__list-item`;

const Node = React.createClass({
  getInitialState() {
    return {
      expanded: false
    };
  },

  render() {
    const children = this.props.node.children;
    const fields = this.props.node.fields;

    return (
      <li className={listItemClassName}>
        <a href=''
           onClick={this.toggle}
           className={`${block}__expand`}>

          <SvgIcon type={this.state.expanded ? 'triangle_down' : 'triangle_right'}
                   width={this.state.expanded ? 7 : 5}
                   className={`${block}__expand-icon`} />
          {this.props.node.name}
        </a>

        {children.length > 0 && this.state.expanded ?
          <ul className={listClassName}>
            {children.map(child =>
              <Node node={child}
                    key={child.name} />
            )}
          </ul>
        : null}

        {fields.length > 0 && this.state.expanded  ?
          <ul className={listClassName}>
            {fields.map(field =>
              <Field field={field}
                     key={field.keyword} />
            )}
          </ul>
        : null}
      </li>
    );
  },

  toggle(e) {
    e.preventDefault();
    this.setState({expanded: !this.state.expanded});
  }
});


export default function AvailableKeywords() {
  return (
    <div className={block}>
      <MenuHeading>
        Available Search Keywords
      </MenuHeading>

      <ul className={`${listClassName} ${listClassName}--root`}>
        {fieldsCategorized.children.map(node =>
          <Node node={node}
                key={node.name} />
        )}
      </ul>
    </div>
  );
}


function Field({field}) {
  return (
    <li className={`${block}__field ${listItemClassName}`}>
      <a href=''
         onClick={e => onSelectField(e, field)}>
        {field.alias}
      </a>
    </li>
  );
}


function onSelectField(e, field) {
  e.preventDefault();
  mutateQuery(q => `${q} ${field.alias}:"${field.alias}"`.trim());
}
