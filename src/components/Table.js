import React from 'react';

import { createPlate, useList } from '../database';
import { PlatePreview } from '.';
import { useUser } from '../auth';

export function Table() {
  const user = useUser();
  const table = useList(user?`tables/${user.uid}`:null);

  function inner() {
    if (table)
      return table.map(
        x => <PlatePreview listKey={x.key} key={x.key} plateId={x.val} />
      )
    else
      return <>Loading...</>
  }

  return (
    <div className="plate-container-right">
      { inner() }
      <button className="preview-button-new" onClick={() => createPlate(user)}>
        New List
      </button>
    </div>
  );
}

