import React from 'react';

import { BasePlate, Table, Plate, ItemDetails } from  '../components';
import { useParams } from 'react-router-dom';
import { logout, AuthCheck } from '../auth';

import '../styles/general.sass'


export function HomePage () {
  const { plateId, itemKey } = useParams();
  function rightContent() {
    if (itemKey) return <ItemDetails plateId={plateId} itemKey={itemKey} />
    if (plateId) return <Plate plateId={plateId} />
    return <Table />
  }
  return (
    <div className="page">
      <h1>plates</h1>
      <button onClick={() => logout()}> Log Out </button>
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
