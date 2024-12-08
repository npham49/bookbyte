import { CronJob } from "cron";
import { getFirstBookAndSplit } from "./jobs/booksplitting.job";
import { summarizeJob } from "./jobs/summarize.job";

let running = false;

async function splittingOperation() {
  if (running) {
    return;
  }

  running = true;
  // do stuff
  const d = new Date();
  console.log("At Ten Minutes:", d);
  await getFirstBookAndSplit();
  await summarizeJob();
  running = false;
}

console.log("Before job instantiation");
const job = new CronJob("*/10 * * * * *", function () {
  splittingOperation();
});
console.log("After job instantiation");
job.start();
