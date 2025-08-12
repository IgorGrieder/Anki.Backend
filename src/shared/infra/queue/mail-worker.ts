import { getRedis } from "../redis/redis-client";
import { sendMail, MailJob } from "../mail/mailer";

const QUEUE_KEY = "mail_queue";

const run = async () => {
  const client = getRedis();
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const res = await client.brpop(QUEUE_KEY, 0);
    if (res && res[1]) {
      try {
        const job: MailJob = JSON.parse(res[1]);
        await sendMail(job);
      } catch (err: any) {
        console.error("Mail worker error", err);
      }
    }
  }
};

void run();
