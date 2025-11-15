import mongoose from "mongoose";
import Subscription from "../models/subscription.model.js";
import { workFlowClient } from "../config/upstash.js";
import { SERVER_URL } from "../config/env.js";

export const createsubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.create({
      ...req.body,
      user: req.user._id,
    });

    const result = await workFlowClient.trigger({
      url: `${SERVER_URL}/api/v1/workflow/subscription/remainder`,
      body: {
        subscriptionId: subscription.id,
      },
      headers: {
        "content-type": "application/json",
      },
      retries: 0,
    });

    res.status(200).json({
      success: true,
      subscription,
      workflowId: result.workflowId, // NOW this works
      delivered: result.delivered, // Optional but nice
    });
  } catch (error) {
    next(error);
  }
};

export const getUserSubscription = async (req, res, next) => {
  try {
    if (req.user.id != req.params.id) {
      const error = new Error("Don't try to fool with me Nigesh ");
      error.status = 401;
      throw error;
    }
    const subscriptions = await Subscription.find({ user: req.params.id });
    res.status(200).json({
      success: true,
      subscriptions,
    });
  } catch (error) {
    next(error);
  }
};
export const deleteUserSubscription = async (req, res, next) => {
  try {
    const subid = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(subid)) {
      const error = new Error("You are not the one");
      error.statusCode = 401;
      throw error;
    }
    const subscription = await Subscription.findById(subid);
    if (!subscription) {
      const error = new Error("Please get out");
      error.statusCode = 401;
      throw error;
    }
    if (subscription.user.toString() !== req.user.id) {
      const error = new Error("Please get out");
      error.statusCode = 401;
      throw error;
    }
    await Subscription.deleteOne();
    res.status(200).json({
      success: true,
      message: "Subscription deleted Succesfully",
    });
  } catch (error) {
    next(error);
  }
};

export const UpdateSubscription = async (req, res, next) => {
  try {
    const subid = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(subid)) {
      const error = new Error("Nope ,I can 't");
      error.statusCode = 401;
      throw error;
    }
    const subscription = await Subscription.findById(subid);
    if (!subscription) {
      const error = new Error("No subscription found");
      error.statusCode = 403;
      throw error;
    }
    if (subscription.user.toString() !== req.user.id) {
      const error = new Error("No Match");
      error.statusCode = 403;
      throw error;
    }
    const updatedData = { ...req.body };
    delete updatedData.user;
    delete updatedData._id;
    const updated = await Subscription.findByIdAndUpdate(subid, updatedData, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      success: true,
      message: "Updated data successfully",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};
