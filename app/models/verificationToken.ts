import { Model, model, models, Schema } from "mongoose";
import { hashSync, compareSync, genSaltSync } from "bcryptjs";

interface VerificationTokenDoc {
  token: string;
  userId: string;
  expires: Date;
}

interface Methods {
  compare(token: string): boolean;
}

const schema = new Schema<VerificationTokenDoc, {}, Methods>({
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
    default: () => Date.now(),
    expires: 60 * 60 * 24, // 1 día
  },
});

schema.pre("save", function () {
  if (this.isModified("token")) {
    const salt = genSaltSync(10);
    this.token = hashSync(this.token, salt);
  }
});

schema.methods.compare = function (token: string): boolean {
  return compareSync(token, this.token);
};

const VerificationTokenModel =
  models.VerificationToken || model<VerificationTokenDoc, Model<VerificationTokenDoc, {}, Methods>>("VerificationToken", schema);

export default VerificationTokenModel;