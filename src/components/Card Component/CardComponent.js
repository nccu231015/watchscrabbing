"use client"

import Card from '../card/Card';
import './cardcomponent.css';
import moment from 'moment';

export default function CardComponent({ wt=[], bought, initValue }) {
  const now = moment();

  if(!initValue){
    return <div>loading...</div>
  }

  if ( wt.length == 0) {
    return <div>沒有資料...</div>;
  }

  return (
    <div className="flex">
      {wt.map((watch, index) => {
       
          return <Card key={index} watch={watch} />;

        return null;
      })}
    </div>
  );
}
