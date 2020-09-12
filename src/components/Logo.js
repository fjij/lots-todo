import React from 'react';

import { Link } from 'react-router-dom';

export function Logo ({children}) {
  return (<div className="logo-div">
    <Link className="logo-link" to="/">lots todo</Link>
    <div className="logo-children">
      {children}
    </div>
  </div>)
}
