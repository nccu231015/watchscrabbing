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
       
          return <Card key={index} watch={watch} />;

        return null;
      })}
    </div>
  );
}
