import { getRedis } from "../redis/redis-client";
import type { MailJob } from "../mail/mailer";
import { Worker } from "worker_threads";
import path from "path";
import url from "url";

const QUEUE_KEY = "mail_queue";

export const addEmailJob = async (job: MailJob) => {
  const client = getRedis();
  await client.lpush(QUEUE_KEY, JSON.stringify(job));
};

let worker: Worker | null = null;

export const startMailWorker = () => {
  if (worker) return;
  const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
  const workerPath = path.join(__dirname, "mail-worker.js");
  const workerUrl = url.pathToFileURL(workerPath);
  worker = new Worker(workerUrl as unknown as string);
  worker.on("error", (err) => {
    console.error("Mail worker thread error", err);
  });
  worker.on("exit", (code) => {
    console.error("Mail worker exited with code", code);
    worker = null;
  });
};
