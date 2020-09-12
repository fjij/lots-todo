import React from 'react';

import { BasePlate, Table, Plate, ItemDetails, Nav } from  '../components';
import { useParams } from 'react-router-dom';
import { AuthCheck } from '../auth';

import '../styles/general.sass'
import '../styles/homepage.sass'


export function HomePage () {
  const { plateId, itemKey } = useParams();
  function rightContent() {
    if (itemKey) return <ItemDetails plateId={plateId} itemKey={itemKey} />
    if (plateId) return <Plate plateId={plateId} />
    return <Table />
  }
  return (
    <div className="page">
      <Nav />
      <div className="flex-container">
        <div className="flex">
          <BasePlate />
        </div>
        <div className="flex">
          { rightContent() }
        </div>
      </div>
      <AuthCheck />
    </div>
  );
}
