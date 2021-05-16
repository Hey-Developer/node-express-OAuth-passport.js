const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  userEmail: String,
  googleId: Number,
});

//@ Defining Statics Method...to interact with the db.
userSchema.statics.findOrCreate = async function (userId, userEmail) {
  try {
    const user = await this.findOne({ googleId: userId });
    if (user) {
      return user;
    } else {
      const user = await this.create({
        userEmail,
        googleId: userId,
      });
      return user;
    }
  } catch (error) {
    return {
      googleId: undefined,
      error: error.message,
    };
  }
};

module.exports = model("User", userSchema);
