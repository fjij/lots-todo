import React, {useState} from 'react';
import { useInput } from '../components/input';
import { Logo } from '../components';
import { Redirect } from 'react-router-dom';
import { useUser, login, register } from '../auth';
import '../styles/login.sass';

export function LoginPage (props) {
  const [email, emailInput] = useInput({
    type: "email",
    placeholder: "email",
    inputClassName: "login-input",
  });
  const [password, passwordInput] = useInput({
    type: "password",
    placeholder: "password",
    inputClassName: "login-input",
  });
  const [errorMsg, setErrorMsg] = useState(null);
  const user = useUser();

  function goLogin() {
    function codeToMsg(code) {
      switch(code) {
        case 'auth/invalid-email':
          return "Invalid email address."
          break;
        default:
          return "The email or password was incorrect.";
          break;
      }
    }
    function onError(code) {
      setErrorMsg(codeToMsg(code))
    }
    login(email, password, onError)
  }

  if (user) return <Redirect to="/"/>

  return (
    <div>
      <div className="login-container">
      <Logo />
        <form className="login-form" onSubmit={() => goLogin()}>
          <div className="login-input-container">{emailInput}</div>
          <div className="login-input-container">{passwordInput}</div>
          <div className="login-footer">
            <input type="submit" className="btn" value="Login" />
            <button className="btn" onClick={() => register(email, password)}> Register </button>
          </div>
        </form>
        <p className="login-error">
        { errorMsg }
        </p>
      </div>
    </div>
  );
}
