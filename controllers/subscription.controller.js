import Subscription from "../models/subscription.model.js";

export const createsubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.create({
      ...req.body,
      //user._id was comming from authorize middleware , as it enables creating subscription only if the auhtor is logined
      user: req.user._id,
    });
    res.status(200).json({
      success: true,
      subscription,
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
