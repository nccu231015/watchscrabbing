// lib/taskQueue.js
import { Queue, Worker } from 'bullmq';
import Redis from 'ioredis';
import { clusterTask } from './StartScrabbing';
import { watchesss } from '../Database/database';

const connection = new Redis();

const scrapeQueue = new Queue('scrapeQueue', { connection });

const worker = new Worker('scrapeQueue', async job => {
  const { shop, pages } = job.data;
  await clusterTask(watchesss, shop, pages);
}, { connection });

export const queueTask = async (shop, pages) => {
  await scrapeQueue.add('scrape', { shop, pages });
};