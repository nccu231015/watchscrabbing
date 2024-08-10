import Card from '../card/Card';
import './cardcomponent.css';
import moment from 'moment';

export default function CardComponent({ wt = [], bought }) {
  const now = moment();

  if (!wt || wt.length === 0) {
    return <div>沒有資料...</div>;
  }

  return (
    <div className="flex">
      {wt.map((watch, index) => {
        const lastUpdatedAt = moment(watch.latestUpdate);
        const difference = now.diff(lastUpdatedAt, 'minutes');
        if (
          (bought === "unsale" && difference < 60) ||
          (bought === "sale" && difference > 60) ||
          !bought
        ) {
          return <Card key={index} watch={watch} />;
        }

        return null;
      })}
    </div>
  );
}
