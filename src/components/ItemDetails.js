import React from 'react';
import { useItem, editItem } from '../database';
import { useInput } from '../components/input';
import { Link } from 'react-router-dom';
import { XCircleFillIcon } from '@primer/octicons-react';
import { PlateRef } from '../components';

import '../styles/item_details.sass'

export function ItemDetails ({plateId, itemKey}) {
  const item = useItem(plateId, itemKey)

  const updateTitle = () =>
    editItem(plateId, itemKey, "name", newTitle);

  const [newTitle, titleInput] = useInput({
    defaultValue: item?item.name:"",
    inputClassName: "item-title-input",
    formClassName: "item-title-form",
    onBlur: updateTitle,
    onSubmit: updateTitle,
  })

  // Todo: Periodically save

  const updateDetails = () =>
    editItem(plateId, itemKey, "details", newDetails);

  const [newDetails, detailsInput] = useInput({
    defaultValue: item?item.details:"",
    multi: true,
    inputClassName: "item-details-input",
    formClassName: "item-details-form",
    onBlur: updateDetails,
    onSubmit: updateDetails,
  })


  function inner() {
    return (<>
      <div className="item-title-bar">
        <div className="left-flex">
          { titleInput }
        </div>
        <Link className="item-close-link" to={`/plate/${plateId}`}>
          <XCircleFillIcon size="medium" />
        </Link>
      </div>
      <PlateRef {...{plateId}} />
      { detailsInput }
    </>);
  }

  return (
    <div className="plate-container-right">
      <div className="item-details">
        {item?inner():<>Loading...</>}
      </div>
    </div>
  );
}
