import React, { useState, useEffect, useRef } from 'react';
import '../../styles/item.sass'

// useInput({type})
// Returns an input component as well as the hook to it's value.
export function useInput({
  type="text", 
  onFocus=() => {}, 
  onBlur=() => {}, 
  defaultValue="",
  formClassName,
  inputClassName,
  onSubmit=() => {},
  onDelete=() => {},
  onNew=() => {},
  shouldFocus=false,
  multi=false,
  placeholder="",
  }) {

  const [value, setValue] = useState(defaultValue);
  const [focused, setFocused] = useState(false);

  function checkDelete(e){
    if (e.keyCode === 8 || e.keyCode === 46) {
      if (value === "") {
        onDelete();
      }
    }
  }
  function checkNew(e){
    if (value !== "") {
    if (ref.current)
      ref.current.blur();
      onNew();
    }
  }
  const ref = useRef(null);
  useEffect(() => {
    setValue(defaultValue);
    // autofocus
    if (ref.current && shouldFocus)
      ref.current.focus();
  }, [defaultValue]);

  const formArgs = {
    className: formClassName,
    onSubmit: e => { onSubmit(); checkNew(e); e.preventDefault(); },
  }

  const inputArgs = {
    placeholder,
    className: inputClassName,
    value,
    onChange: e => setValue(e.target.value),
    type,
    onFocus: e => {setFocused(true); onFocus(e);},
    onBlur: e => {setFocused(false); onBlur(e);},
    ref,
    onKeyDown: e => { checkDelete(e); },
  }

  const input = (
    <form {...formArgs} >
      { multi? <textarea {...inputArgs} />:<input {...inputArgs} />}
    </form>
  );
  return [value, input];
}

export function ItemButton ({ onClick, children, slim}) {
  const className = slim?`item-button-slim`:`item-button`;
  return <button tabIndex="-1" className={className} onClick={onClick}>{children}</button>
}
