import Card from '../card/Card';
import './cardcomponent.css';
import moment from 'moment';

export default function CardComponent({ wt = [], bought }) {
  const now = moment();

  return (
    wt.length==0? <div>沒有資料...</div>:
    <div className="flex">
      {wt==[]?<div></div>:wt.map((watch, index) => {
        const lastUpdatedAt = moment(watch.latestUpdate);
        const difference = now.diff(lastUpdatedAt, 'minutes');
        if ((bought && difference < 60) || (!bought && difference > 60) || bought === 'all') {
          return <Card key={index} watch={watch} />;
        }
        return null;
      })}
    </div>
  );
}