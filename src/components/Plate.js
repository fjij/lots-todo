import React, {useEffect, useState} from 'react';
import * as firebase from 'firebase';
import { Item } from '.';
import { editItem, createItem, useList, useValue } from '../database';
import { useInput } from '../components/input';
import { Link } from 'react-router-dom';
import { XCircleFillIcon } from '@primer/octicons-react';
import { handleMoveRequestList, makeSpace } from '../components/Grabbable'

import '../styles/plate.sass'

export function Plate ({ plateId }) {
  const plate = useValue(`metadata/${plateId}`);
  const allItems = useList(`items/${plateId}`);
  const items = allItems?allItems.filter(x => !x.val.done):null;
  const doneItems = allItems?allItems.filter(x => x.val.done):null;
  if (items) items.sort((a, b) => a.val.index - b.val.index);
  if (doneItems) doneItems.sort(
    (a, b) => new Date(b.val.dateCompleted) - new Date(a.val.dateCompleted)
  );

  const [dateLoaded, setDateLoaded] = useState(null);

  useEffect(() => {
    setDateLoaded(Date.now());
  }, []);

  const [newTitle, titleInput] = useInput({
    inputClassName: 'plate-title-input',
    formClassName: 'plate-title-form',
    onBlur: updateName,
    onSubmit: updateName,
    defaultValue: plate?plate.name:"",
  });

  function updateName() {
    const nameRef = firebase.database().ref(`metadata/${plateId}/name`);
    nameRef.set(newTitle);
  }

  function indexSetter(itemHolder, val) {
    editItem(plateId, itemHolder.key, "index", val);
  }
  
  function indexGetter(itemHolder) { 
    if (typeof itemHolder.val.index !== 'undefined')
      return itemHolder.val.index;
    if (!items || items.length === 0) {
      return 0;
    }
    const idx = (items[items.length - 1].val.index + 1);
    return idx;
  }

  function handleNew(item, pos) {
    return () => {
      createItem(plateId, "", item.val.index+1);
      makeSpace(items, indexGetter, indexSetter, pos, x => x+1);
    }
  }

  if (plate && items) {
    return (
      <div className="plate-container-right">
        <div className="plate">
          <div className="plate-title-bar">
            <div className="left-flex">
              { titleInput }
            </div>
            <Link className="plate-close-link" to="/">
              <XCircleFillIcon size="medium" />
            </Link>
          </div>
          <div className="plate-list">
          <div className="plate-list-inner">
            {
              items.map( (item, pos) => (
              <Item
                plateId={plateId}
                listKey={item.key}
                key={item.key}
                item={item.val}
                pos={pos}
                grabbable
                onMoveRequest={
                  handleMoveRequestList(items, indexGetter, indexSetter, pos)
                }
                onNew={
                  handleNew(item, pos)
                }
                shouldFocus={item.val.dateCreated>dateLoaded}
                itemCount={items.length}/> ))
            }
            {
              doneItems.map( (item, pos) => ( <Item
                plateId={plateId}
                listKey={item.key}
                key={item.key}
                item={item.val} /> ))
            }
            <button className="item-button-new"
              onClick={() => {
                if (!items) return;
                if (items.length === 0) {
                  createItem(plateId, "", 0)
                  return;
                }
                const idx = (items[items.length - 1].val.index + 1);
                createItem(plateId, "", idx)
              }}>
                New Item
            </button>
          </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <h3>Loading...</h3>
      </div>
    );
  }
}
