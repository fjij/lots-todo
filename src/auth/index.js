import React, { useState, useEffect } from 'react';
import * as firebase from 'firebase';
import { Redirect } from 'react-router-dom';

export function useUser() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const auth = firebase.auth();
    auth.onAuthStateChanged(setUser);
  }, []);
  return user;
}

export function login (email, password, onError) {
  const auth = firebase.auth();
  auth.signInWithEmailAndPassword(email, password).catch(e => {
    onError(e.code)
  });
}

export function register (email, password, onError) {
  const auth = firebase.auth();
  auth.createUserWithEmailAndPassword(email, password).catch(e => {
    onError(e.code)
  });
}

export function logout() {
  const auth = firebase.auth();
  auth.signOut();
}

export function AuthCheck() {
  const [shouldKick, setShouldKick] = useState(false);
  useEffect(() => {
    const auth = firebase.auth();
    auth.onAuthStateChanged(user => {
      if (!user) setShouldKick(true);
    });
  }, []);
  if (shouldKick) return <Redirect to="/login" />
  return <></>;
}

