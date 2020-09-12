import React, { useState, useEffect } from 'react';
import { generate } from 'randomstring';
import Draggable from 'react-draggable';

// list: [] of Item
// indexGetter: (x: Item) => integer
// indexSetter: (x: Item, idx: number) => integer
// * setter can be async
// pos: integer
export function handleMoveRequestList(list, indexGetter, indexSetter, pos) {
    return (dpos) => {

      if (dpos === 0) return;
      const targetPos = Math.min(Math.max(pos + dpos, 0), list.length-1);
      if (targetPos === pos) return;

      const moverItem = list[pos];
      const targetItem = list[targetPos];

      const next = x => (pos < targetPos)?(x+1):(x-1);
      var newIndex = next(indexGetter(targetItem));
      var newPos = next(targetPos);
      indexSetter(moverItem, newIndex);
      while(true) {
        if (newPos < 0 || newPos >= list.length) break;
        const newItem = list[newPos];
        if (indexGetter(newItem) !== newIndex) break;
        newIndex = next(newIndex);
        newPos = next(newPos);
        indexSetter(newItem, newIndex);
      }
    }
}

export function makeSpace(list, indexGetter, indexSetter, pos, next) {
  const baseItem = list[pos];
  var newIndex = next(indexGetter(baseItem));
  var newPos = next(pos);
  while(true) {
    if (newPos < 0 || newPos >= list.length) break;
    const newItem = list[newPos];
    if (indexGetter(newItem) !== newIndex) break;
    newIndex = next(newIndex);
    newPos = next(newPos);
    indexSetter(newItem, newIndex);
  }
  return next(indexGetter(baseItem));
}

export function Grabbable({
  children,
  handle,
  onMoveRequest,
  onStart,
  onStop,
  pos,
  count}) {

  const [dy, setDy] = useState(0);
  const [height, setHeight] = useState(0);
  const handleDrag = (e, ui) => setDy(dy => dy + ui.deltaY);
  function handleStart(e) {
    onStart();
  }
  function handleStop(e) {
    onStop();
    const dpos = Math.round(dy/height);
    onMoveRequest(dpos);
    setDy(0);
  }
  const [className] = useState(generate());
  useEffect(() => {
    setHeight(document.getElementsByClassName(className)[0].clientHeight);
  }, [className]);
  const nodeRef = React.useRef(null);
  return (
    <Draggable
      axis="y"
      position={{x: 0, y: 0}}
      handle=".handle"
      onStart={handleStart}
      onDrag={handleDrag}
      onStop={handleStop}
      bounds={{
        top: -pos*height,
        bottom: height*(count-1-pos)
      }}
      nodeRef={nodeRef}>
      <div ref={nodeRef} className={className}>
        {children}
      </div>
    </Draggable>);
}
