import "./env";
import { processNotifications } from "./notifications";

(async function () {
  await processNotifications();
})();
