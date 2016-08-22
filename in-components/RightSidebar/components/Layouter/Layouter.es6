import React from 'react';

import FruchtermannReingold from 'in-map/misc/logical/layoutingStrategies/FruchtermannReingold';
import Chessboard from 'in-map/misc/logical/layoutingStrategies/Chessboard';
import {setLayoutingStrategy} from 'in-map/stores/logical/layouterStore';
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
    </div>
  );
}
