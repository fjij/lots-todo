import React from 'react';
import { useUser } from '../auth';
import { useValue } from '../database';
import { Link } from 'react-router-dom';

export function PlateRef({plateId}) {
  const user = useUser();
  const plateName = useValue(
    user?`metadata/${plateId}/name`:null,
  );
  return (
    <div className="plate-ref">
      {plateName?<>
        from <Link className="plate-ref-link" to={`/plate/${plateId}`}>
          {plateName}
        </Link>
      </>:""}
    </div>
  );
}
