import { CallbackError, Model, model, models, Schema } from "mongoose";
import { hashSync, compareSync, genSaltSync } from "bcryptjs";

interface PassResetTokenDoc {
  token: string;
  userId: string;
  expires: Date;
  used?: boolean;
}

interface Methods {
  compare(token: string): boolean;
  isExpired(): boolean;
}

const schema = new Schema<PassResetTokenDoc, {}, Methods>({
  token: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  expires: {
    type: Date,
    default: () => new Date(Date.now() + 60 * 60 * 1000), // 1 hour from creation
    index: { expires: 0 } // TTL index to automatically delete expired tokens
  },
  used: {
    type: Boolean,
    default: false
  }
});

schema.pre("save", function (next) {
  if (this.isModified("token")) {
    try {
      const salt = genSaltSync(10);
      this.token = hashSync(this.token, salt);
      next();
    } catch (err: any) {
      next(err as CallbackError);
    }
  } else next();
});

schema.methods.compare = function (token: string): boolean {
  return compareSync(token, this.token);
};

schema.methods.isExpired = function (): boolean {
  return Date.now() >= this.expires.getTime();
};

// Create indexes
schema.index({ userId: 1 });
schema.index({ token: 1 });
schema.index({ expires: 1 });

const PassResetTokenModel = models.PassResetToken || model<PassResetTokenDoc, Model<PassResetTokenDoc, {}, Methods>>("PassResetToken", schema);

export default PassResetTokenModel;
