import React from 'react';

import FruchtermannReingold from 'in-map/src/3DSceneObjects/process/layoutingStrategies/FruchtermannReingold';
import OrderByType from 'in-map/src/3DSceneObjects/process/layoutingStrategies/OrderByType';
import Chessboard from 'in-map/src/3DSceneObjects/process/layoutingStrategies/Chessboard';
import {setLayoutingStrategy} from 'in-map/src/stores/process/layouterStore';
import Button from 'in-components/Button';


export default function SidebarLayouterListing() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Button onClick={() => setLayoutingStrategy(FruchtermannReingold)}>
        Fruchtermann Reingold
      </Button>

      <br/>

      <Button onClick={() => setLayoutingStrategy(Chessboard)}>
        Chessboard
      </Button>

      <br/>

      <Button onClick={() => setLayoutingStrategy(OrderByType)}>
        Order by Type
      </Button>
    </div>
  );
}
