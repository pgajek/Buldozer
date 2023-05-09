import { JobOptions, QueueOptions } from 'bull';
import config from '../config';

export type QueueSettings = {
    name: string;
    jobOptions: JobOptions;
};

export let redisConfig: QueueOptions = {
    redis: {
        host: config.REDIS_HOST,
        port: config.REDIS_PORT,
    },
};

export const port = config.PORT;

