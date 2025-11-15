import { serve } from "@upstash/workflow/express";
import Subscription from "../models/subscription.model.js";
import dayjs from "dayjs";
import { sendReminderEmail } from "../utils/send-email.js";

const REMINDERS = [7, 5, 3, 1];

export const sendRemainders = serve(async (context) => {
  const { subscriptionId } = context.requestPayload;

  const subscription = await fetchSubscription(context, subscriptionId);

  if (!subscription || subscription.status !== "active") return;

  const renewalDate = dayjs(subscription.renewalDate);

  // If renewal date is already passed, stop workflow
  if (renewalDate.isBefore(dayjs())) {
    console.log(
      `Renewal date has passed for Subscription ${subscriptionId}. Stopping workflow.`
    );
    return;
  }

  // Schedule reminders
  for (const daysBefore of REMINDERS) {
    const reminderDate = renewalDate.subtract(daysBefore, "day");

    // Skip old reminders
    if (reminderDate.isBefore(dayjs())) continue;

    await sleepUntilReminder(
      context,
      `Reminder ${daysBefore} days before`,
      reminderDate
    );
    await triggerReminder(context, `Reminder ${daysBefore} days before`);
  }
});

const fetchSubscription = async (context, subscriptionId) => {
  return context.run("Get subscription", async () => {
    return Subscription.findById(subscriptionId).populate("user", "name email");
  });
};

const sleepUntilReminder = async (context, label, date) => {
  console.log(`Sleeping until ${label} at ${date}`);
  await context.sleepUntil(label, date.toDate());
};

const triggerReminder = async (context, label) => {
  return context.run(label, async () => {
    console.log(`Triggering ${label}`);
    await sendReminderEmail({
      to: Subscription.user.email,
      type: label,
      Subscription,
    });
  });
};
