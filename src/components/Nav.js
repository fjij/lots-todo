import React from 'react';
import { Logo } from '../components';
import { logout, useUser } from '../auth';

import '../styles/nav.sass'

export function Nav () {
  const user = useUser();
  const username = user?user.email:"";
  return (<div className="nav">
    <div className="nav-inner">
      <Logo>
        <button className="btn">{username}</button>
        <button className="btn" onClick={() => logout()}> Log Out </button>
      </Logo>
    </div>
  </div>);
}
