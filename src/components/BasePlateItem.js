import React, {useState} from 'react';
import { useInput, ItemButton } from '../components/input';
import { Grabbable } from '../components/Grabbable';
import {
  editItem,
  editItemLink,
  removeItemLink,
  useValue,
  itemDetailsPreview
} from '../database';
import { useUser } from '../auth';
import { CheckIcon, XIcon, GrabberIcon } from '@primer/octicons-react';
import { PlateRef } from '../components';

// TODO: Periodically save

export function BasePlateItem({
  val,
  listKey,
  onMoveRequest=()=>{},
  count,
  pos,
}) {
  const plateId = val.plateId;
  const itemKey = val.key;

  const [isHovering, setIsHovering] = useState(false);

  const user = useUser();
  const item = useValue(
    user?`items/${plateId}/${itemKey}`:null,
    () => { if (user) removeItemLink(user, listKey); },
  );
  const [name, input] = useInput({
    defaultValue: item?item.name:"", 
    onBlur: updateName,
    onSubmit: updateName,
    formClassName: "item-form",
    inputClassName: "item-input",
  });


  function updateName() {
    editItem(plateId, itemKey, "name", name);
  }

  function returnItem() {
    if (!user) return;
    removeItemLink(user, listKey)
    editItem(plateId, itemKey, "user", "");
  }
  function completeItem() {
    if (!user) return;
    removeItemLink(user, listKey)
    editItem(plateId, itemKey, "user", "");
    editItem(plateId, itemKey, "done", true);
    editItem(plateId, itemKey, "dateCompleted", Date.now());
  }

  const [isDragging, setIsDragging] = useState(false);

  function Grabber() {
    function Button() {
      if (!isDragging && !isHovering )
        return <ItemButton slim/>

      return (<ItemButton slim>
        <GrabberIcon size="medium"/>
      </ItemButton>);
    }
    return <div className="handle"><Button /></div>
  }

  function RightButtons() {
    if (!isHovering)
      return <><ItemButton /><ItemButton /></>;
    return (<>
      <ItemButton onClick={completeItem}><CheckIcon size="medium"/></ItemButton>
      <ItemButton onClick={returnItem}><XIcon size="medium" /></ItemButton>
    </>);
  }

  const detailsText = itemDetailsPreview(item, 40);
  return (
    <Grabbable
      handle=".handle"
      onStart={() => setIsDragging(true)}
      onStop={() => setIsDragging(false)}
      onMoveRequest={onMoveRequest}
      pos={pos}
      count={count} >

      <div className={
        "item"
        + (isDragging?" item-drag":"")
        }
        onMouseEnter={e => {
          if (e.buttons === 0)
            setIsHovering(true);
        }}
        onMouseLeave={e => {
          if (e.buttons === 0)
            setIsHovering(false)
        }}>
        <Grabber />
        <div className="item-text">
          {input}
          <PlateRef {...{plateId}} />
          <div className="item-sub" style={{display: "inline"}}>
            {detailsText}
          </div>
        </div>
        <RightButtons />
      </div>
    </Grabbable>
  );
}
