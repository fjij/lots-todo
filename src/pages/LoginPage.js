import React from 'react';
import { useInput } from '../components/input';
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
    <div className="login-container">
      <h1>Login</h1>
      {emailInput} <br />
      {passwordInput} <br />
      <button onClick={() => login(email, password)}> Login </button>
      <button onClick={() => register(email, password)}> Register </button>
    </div>
  );
}
