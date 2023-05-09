import express from 'express';
import bodyParser from 'body-parser';
import Queue, { Queue as QueueType, Job } from 'bull';
import { redisConfig, port } from './settings';

const app = express();
app.use(bodyParser.json());

const postgresQueue = new Queue('PostgresQueue', redisConfig);
const submitTransactionQueue = new Queue('SubmitTransactionQueue', redisConfig);

export const retryQueueTask = async (queueName: string, amount: number) => {
    let jobs;
    let counter = 0;
    let completed;
    let failed;

    switch (queueName) {
        case 'PostgresQueue':
            jobs = await postgresQueue.getFailed(0, amount);
            completed = await postgresQueue.getCompletedCount();
            failed = await postgresQueue.getFailedCount();
        case 'SubmitTransactionQueue':
            jobs = await submitTransactionQueue.getFailed(0, amount);
            completed = await submitTransactionQueue.getCompletedCount()
            failed = await submitTransactionQueue.getFailedCount()
    }

    for (const job of jobs) {
        try {
            await job.retry();
            counter += 1;
            console.log('counter: ', counter)
        } catch (err) {
            console.log(`Error job[${counter}]: ${job.data}`);
        }
    }
    console.log('completed: ', completed)
    console.log('failed: ', failed)
    return { status: 'ok', retried: counter };
};

app.get('/health', (_req, res) => {
    return res.sendStatus(200);
});

app.post('/retryQueue', async (req, res) => {
    const { amount, queueName } = req.body;

    const regEx = new RegExp('^[0-9]+$');

    if (!regEx.test(amount)) {
        return res.status(400).send('Amount must be a number');
    }

    try {
        const result = await retryQueueTask(queueName, amount);
        return res.status(200).json(result);
    } catch (err) {
        res.status(500).send('Retrying jobs has failed');
    }
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});

