import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "user is not defined"],
      trim: true,
      minLength: 2,
      maxLength: 50,
    },
    price: {
      type: Number,
      required: [true, "user email is required"],
      min: [0, "minimum greater than least subscription"],
    },
    currency: {
      type: String,
      enum: ["rupees", "usd", "dinams", "yen", "dollars", "other"],
      default: "rupees",
    },
    frequency: {
      type: String,
      enum: ["daily", "weekly", "monthly", "yearly"],
      default: "monthly",
    },
    category: {
      type: String,
      enum: [
        "sports",
        "anime",
        "tv shows",
        "news",
        "movies",
        "web series",
        "music",
        "manga",
        "others",
      ],
      required: true,
    },
    paymentMode: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "expired", "expired"],
      default: "active",
    },
    startDate: {
      type: Date,
      required: true,
      validate: {
        validator: (value) => value <= new Date(),
        message: "Start date should not be in future",
      },
    },
    renewalDate: {
      type: Date,
      validate: {
        validator: function (value) {
          return value > this.startDate;
        },
        message: "Renewal date should not be in Past",
      },
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

subscriptionSchema.pre("save", function (next) {
  if (!this.renewalDate) {
    const renewalPeriods = {
      daily: 1,
      weekly: 7,
      monthly: 30,
      yearly: 365,
    };

    this.renewalDate = new Date(this.startDate);
    this.renewalDate.setDate(
      this.renewalDate.getDate() + renewalPeriods[this.frequency]
    );
  }

  // Auto-update the status if renewal date has passed
  if (this.renewalDate < new Date()) {
    this.status = "expired";
  }

  next();
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);
export default Subscription;
//name,price,currency,frequency,category,paymentmode,status,startDate,renewaldate
