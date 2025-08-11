import { getRedis } from "../redis/redis-client";
import { sendMail, MailJob } from "../mail/mailer";

const QUEUE_KEY = "mail_queue";

export const addEmailJob = async (job: MailJob) => {
  const client = getRedis();
  await client.lpush(QUEUE_KEY, JSON.stringify(job));
};

export const startMailWorker = async (): Promise<void> => {
  const client = getRedis();
  const loop = async () => {
    const res = await client.brpop(QUEUE_KEY, 0);
    if (res && res[1]) {
      try {
        const job: MailJob = JSON.parse(res[1]);
        await sendMail(job);
      } catch (err: any) {
        console.error("Mail worker error", err);
      }
    }
    setImmediate(loop);
  };

  void loop();
};
