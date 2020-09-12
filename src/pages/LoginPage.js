import React from 'react';
import { useInput } from '../components/input';
import { Logo } from '../components';
import { Redirect } from 'react-router-dom';
import { useUser, login, register } from '../auth';
import '../styles/login.sass';

export function LoginPage (props) {
  const [email, emailInput] = useInput({
    type: "email",
    placeholder: "email",
    formClassName: "login-form",
    inputClassName: "login-input",
    onSubmit: goLogin
  });
  const [password, passwordInput] = useInput({
    type: "password",
    placeholder: "password",
    formClassName: "login-form",
    inputClassName: "login-input",
    onSubmit: goLogin
  });
  const user = useUser();

  function goLogin() {
    login(email, password);
  }

  if (user) return <Redirect to="/"/>

  return (
    <div>
      <div className="login-container">
      <Logo />
        {emailInput} <br />
        {passwordInput} <br />
        <button className="btn" onClick={() => login(email, password)}> Login </button>
        <button className="btn" onClick={() => register(email, password)}> Register </button>
      </div>
    </div>
  );
}
