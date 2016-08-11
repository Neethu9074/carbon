import React from 'react';

import FR from 'in-map/src/3DSceneObjects/process/layoutingStrategies/FruchtermannReingold';
import Chessboard from 'in-map/src/3DSceneObjects/process/layoutingStrategies/Chessboard';
import {setLayoutingStrategy} from 'in-map/src/stores/process/layouterStore';
import Button from 'in-components/Button';


export default function SidebarLayouterListing() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Button onClick={() => setLayoutingStrategy(new FR())}>
        Fruchtermann Reingold
      </Button>

      <br/>

      <Button onClick={() => setLayoutingStrategy(new Chessboard())}>
        Chessboard
      </Button>
    </div>
  );
}
