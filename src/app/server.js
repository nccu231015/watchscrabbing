import express from 'express';
import next from 'next';
import axios from 'axios';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(async () => {
    const server = express();

    // Example API endpoint for cron job
    const cronEndpoint = 'http://localhost:3000/api/cron'; // Adjust as per your actual API endpoint

    // Scheduler function
    const runScheduler = async () => {
        try {
            const response = await axios.post(cronEndpoint, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            console.log('Scheduler response:', response.data);
        } catch (error) {
            console.error('Error running scheduler:', error);
        }
    };

    server.all('*', (req, res) => {
        return handle(req, res);
    });

    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);

        runScheduler(); // Start the scheduler after the server is listening
    });
});
