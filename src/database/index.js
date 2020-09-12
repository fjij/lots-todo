import {useEffect, useState} from 'react';
import * as firebase from 'firebase';
const randomString = require('randomstring');


function newPlate(user) {
  return {
    name: 'New List',
    owner: `${user.uid}`,
    dateCreated: Date.now(),
    color: 'red',
    todoCount: 0,
    todoText: "",
  };
}

export function createPlate(user) {
  if (!user) return;
  const plateId = randomString.generate();

  const tableRef = firebase.database().ref(`tables/${user.uid}`);
  const plateRef = firebase.database().ref(`metadata/${plateId}`);

  const data = newPlate(user);

  plateRef.set(data);
  tableRef.push().set(plateId);
}

export function newItemData(name, index) {
  return {
    name,
    user: "",
    details: "",
    dateDue: null,
    timeDue: null,
    done: false,
    index,
    dateCreated: Date.now(),
  };
}

export function useItem(plateId, itemKey) {
  return {
    ...newItemData("", 0),
    ...useValue(`items/${plateId}/${itemKey}`),
  }
}

export function itemDetailsPreview(item, chars) {
  const fullText = item&&item.details?item.details:"";
  const cutText = fullText.substring(0, chars);
  return cutText;
}

function touchMetadata(plateId) {
  // TODO
}

export function editItem(plateId, key, property, value) {
    const ref = firebase.database().ref(`items/${plateId}/${key}/${property}`);
    if (value === null) {
      ref.remove();
      return;
    }
    ref.set(value);
}

export function editItemLink(user, listKey, property, value) {
    const ref = firebase.database()
      .ref(`baseplates/${user.uid}/${listKey}/${property}`);
    if (value === null) {
      ref.remove();
      return;
    }
    ref.set(value);
}

export function removeTableEntry(user, listKey) {
  if (!user) return;
  const ref = firebase.database().ref(`tables/${user.uid}/${listKey}`);
  ref.remove();
}

export function removeItem(plateId, itemKey) {
  const itemRef = firebase.database().ref(`items/${plateId}/${itemKey}`);
  itemRef.remove();
}

export function removePlate(plateId) {
  const itemsRef = firebase.database().ref(`items/${plateId}`);
  const metaRef = firebase.database().ref(`metadata/${plateId}`);
  metaRef.remove();
  itemsRef.remove();
}

export function useValue(path, onFail=() => {}) {
  const [value, setValue] = useState(null);
  useEffect(() => {
    if (!path) return;
    const ref = firebase.database().ref(path);
    ref.on('value', snap => {
      const val = snap.val();
      setValue(val);
      if (val == null) {
        onFail();
      }
    });
    return () => {
      ref.off('value');
    }
  }, [path]);
  return value;
}

export function createItemLink(plateId, key, user) {
  if (!user) return;
  const userRef = firebase.database().ref(`items/${plateId}/${key}/user`);
  const bpRef = firebase.database().ref(`baseplates/${user.uid}`);
  const link = newItemLink(plateId, key);

  userRef.set(user.uid);
  bpRef.push().set(link);
}

export function removeItemLink(user, linkKey) {
  if (!user) return;
  const linkRef = firebase.database().ref(`baseplates/${user.uid}/${linkKey}`);
  linkRef.remove();
}

export function createItem(plateId, name, index) {

    const itemsRef = firebase.database().ref(`items/${plateId}`);
    const data = newItemData(name, index);

    itemsRef.push().set(data);

    touchMetadata(plateId);
}

function newItemLink(plateId, key) {
  return {
    plateId,
    key,
  };
}

export function useList(path) {
  const [items, setItems] = useState([]);
  useEffect(() => {
    if (!path) return;
    const ref = firebase.database().ref(path);
    ref.on('child_added', data => {
      setItems(items => {
        const o = {val: data.val(), key: data.key};
        if (items)
          return [...items, o]
        else
          return [o]
      });
    });

    ref.on('child_changed', data => {
      setItems(
        items => items.map(
          item => (item.key === data.key)?
          ({val: data.val(), key: data.key}):(item)
        )
      );
    });

    ref.on('child_removed', data => {
      setItems(items => items.filter(item => item.key !== data.key));
    });

    return () => {
      ref.off('child_added');
      ref.off('child_changed');
      ref.off('child_removed');
    };
  }, [path]);
  return items;
}
