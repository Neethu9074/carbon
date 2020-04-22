import React from 'react';

import Sidebar from 'in-new-components/layout/Sidebar';

export default {
  title: 'Templates|forms/Sidebar',
  component: Sidebar
};

export function SingleHeader() {
  return (
    <div>
      <div style={{ background: '#eee', height: '50px', zIndex: 2 }}>Before</div>
      <Sidebar>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veniam odio animi laborum aut, ratione perferendis
        doloribus nesciunt. Fuga cum molestiae laudantium odit hic, ratione doloremque. Voluptate error possimus maiores
        rem. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veniam odio animi laborum aut, ratione
        perferendis doloribus nesciunt. Fuga cum molestiae laudantium odit hic, ratione doloremque. Voluptate error
        possimus maiores rem. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veniam odio animi laborum aut,
        ratione perferendis doloribus nesciunt. Fuga cum molestiae laudantium odit hic, ratione doloremque. Voluptate
        error possimus maiores rem. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veniam odio animi laborum
        aut, ratione perferendis doloribus nesciunt. Fuga cum molestiae laudantium odit hic, ratione doloremque.
        Voluptate error possimus maiores rem. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veniam odio
        animi laborum aut, ratione perferendis doloribus nesciunt. Fuga cum molestiae laudantium odit hic, ratione
        doloremque. Voluptate error possimus maiores rem. Lorem ipsum dolor sit amet, consectetur adipisicing elit.
        Veniam odio animi laborum aut, ratione perferendis doloribus nesciunt. Fuga cum molestiae laudantium odit hic,
        ratione doloremque. Voluptate error possimus maiores rem.
      </Sidebar>
      <div style={{ background: '#fff3cc' }}>After</div>
    </div>
  );
}
