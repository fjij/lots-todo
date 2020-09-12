import React, {useEffect} from 'react';
import { useUser } from '../auth';
import { useList, editItemLink } from '../database';
import { BasePlateItem } from '../components';
import '../styles/plate.sass'
import { handleMoveRequestList } from '../components/Grabbable'
import DoneImg from '../assets/undraw_working_from_anywhere.svg'

export function BasePlate() {
  const user = useUser();
  const itemLinks = useList(user?`baseplates/${user.uid}`:null);
  if (itemLinks) itemLinks.sort((a, b) => indexGetter(a) - indexGetter(b));

  useEffect(() => {
    itemLinks.map(h => {
      console.log("dfsa")
      if (!h.val.index) {
        indexSetter(h, indexGetter(h));
      }
    });
  }, [itemLinks])

  function inner() {
    if (itemLinks) {
      if (itemLinks.length === 0)
        return (
          <div className="plate-list-text">
            You've got nothing assigned. Woo!
            <br />
            <br />
            Assign some tasks on from the lists on the right.
            <br />
            <br />
            <img src={DoneImg} alt="All done!" className="plate-list-image"/>
          </div>
        )
      return itemLinks.map(
        (x, pos) => <BasePlateItem {...{
          val: x.val,
          key: x.key, 
          listKey: x.key,
          pos,
          onMoveRequest: handleMoveRequestList(itemLinks,
            indexGetter, indexSetter, pos),
          count: itemLinks.length,
        }} />
      );
    } else {
      return <>Loading</>;
    }
  }

  function indexSetter(holder, val) {
    editItemLink(user, holder.key, "index", val);
  }
  
  function indexGetter(holder) { 
    if (typeof holder.val.index !== 'undefined')
      return holder.val.index;
    if (!itemLinks || itemLinks.length === 0) {
      return 0;
    }
    const idx = (itemLinks[itemLinks.length - 1].val.index + 1);
    if (idx)
      return idx;
    return 0;
  }

  return (
    <div className="plate-container-left">
      <div className="plate">
        <div className="plate-title-bar">
          <div className="plate-title">Assigned</div>
        </div>
        <div className="plate-list">
        <div className="plate-list-inner">
        { inner() }
        </div>
        </div>
      </div>
    </div>
  );
}

