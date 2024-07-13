import cron from 'node-cron';
import main from '../../../lib/main.js';



// Schedule the cron job
cron.schedule('*/30 * * * *', () => {
  console.log('Running cron job...');
  main();
});