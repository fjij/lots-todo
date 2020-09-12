import React, {useState} from 'react';
import { useInput, ItemButton } from '../components/input';
import { editItem, createItemLink, removeItem } from '../database';
import { useUser } from '../auth';
import { Grabbable } from '../components/Grabbable';
import { Redirect } from 'react-router-dom';
import { itemDetailsPreview } from '../database';
import {
  GrabberIcon,
  CheckIcon,
  PlusIcon,
  PersonIcon,
  PencilIcon,
} from '@primer/octicons-react';

// TODO: Periodically save


export function Item({
  plateId,
  item,
  listKey,
  onMoveRequest=()=>{},
  itemCount,
  grabbable,
  pos,
  shouldFocus=false,
  onNew=()=>{}}) {
  const [isHovering, setIsHovering] = useState(false);

  const [name, input] = useInput({
    defaultValue: item.name, 
    onBlur: updateName,
    onSumbit: updateName,
    formClassName: "item-form",
    inputClassName: "item-input" + (item.done?" item-input-done":""),
    onNew,
    onDelete: () => removeItem(plateId, listKey),
    shouldFocus
  });
  const user = useUser();

  function updateName() {
    editItem(plateId, listKey, "name", name);
  }
  function takeItem() {
    if (!user) return;
    createItemLink(plateId, listKey, user)
  }
  function uncomplete() {
    editItem(plateId, listKey, "done", false);
  }
  

  function RightButtons() {
    function EditButton() {
      const [shouldRedirect, setShouldRedirect] = useState(false);
      if (shouldRedirect)
        return <>
          <ItemButton />
          <Redirect to={`/plate/${plateId}/${listKey}`} />
        </>
      if ((!isDragging && !isHovering) || item.done)
        return <ItemButton />

      return (<ItemButton onClick={() => setShouldRedirect(true)}>
        <PencilIcon size="medium"/>
      </ItemButton>);
    }
    function UserSlot() {
      if (item.done)
      return (<ItemButton onClick={uncomplete}>
        <CheckIcon size="medium" />
      </ItemButton>);

      if (item.user)
        return <ItemButton><PersonIcon size="medium" /></ItemButton>

      if (!isDragging && !isHovering)
        return <ItemButton />

      return (<ItemButton onClick={() => takeItem()}>
        <PlusIcon size="medium"/>
      </ItemButton>);
    }

    return <><EditButton /><UserSlot /></>;
  }
  // Dragging
  function Grabber() {
    function Button() {
      if (!isDragging && (!isHovering || !grabbable) )
        return <ItemButton slim/>

      return (<ItemButton slim>
        <GrabberIcon size="medium"/>
      </ItemButton>);
    }
    return <div className="handle"><Button /></div>
  }
  const [isDragging, setIsDragging] = useState(false);

  function inner() {
    return (
      <div>
        <div className={
          "item"
          + (isDragging?" item-drag":"")
          + (item.done?" item-done":"")
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
            <div className="item-sub">
              { itemDetailsPreview(item, 80) }
            </div>
          </div>
          <RightButtons />
        </div>
      </div>
    );
  }

  if (!grabbable) return inner();

  return (
    <Grabbable
      handle=".handle"
      onStart={() => setIsDragging(true)}
      onStop={() => setIsDragging(false)}
      onMoveRequest={onMoveRequest}
      pos={pos}
      count={itemCount} >
      { inner() }
    </Grabbable>
  );
}
