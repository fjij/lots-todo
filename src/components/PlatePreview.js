import React, { useState } from 'react';
import { useUser } from '../auth';
import { Link } from 'react-router-dom';
import { useValue, removePlate, removeTableEntry } from '../database';
import '../styles/preview.sass'

function ConfirmDelete({onDelete}) {
  const [show, setShow] = useState(false);
  if (show) {
    return (
      <div>
        Are you sure?
        <button className="btn" onClick={onDelete}>Delete</button>
        <button className="btn" onClick={() => setShow(false)}>Cancel</button>
      </div>
    );
  } else {
    return (
      <div>
        <button className="btn" onClick={() => setShow(true)}>Delete</button>
      </div>
    );
  }
}

export function PlatePreview ({ plateId, listKey }) {
  const user = useUser();
  const plate = useValue(
    user?`metadata/${plateId}`:null,
    () => { if (user) removeTableEntry(user, listKey); },
  );

  if (plate) {
    return (
      <div className="preview">
        <Link className="preview-link" to={`/plate/${plateId}`}>{ plate.name }</Link>
        <ConfirmDelete onDelete={() => removePlate(plateId)} />
      </div>
    );
  } else {
    return (
      <div className="preview">
        <h3>Loading...</h3>
      </div>
    );
  }
}
