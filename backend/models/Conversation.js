const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
  participants: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      userType: {
        type: String,
        enum: ["homeowner", "professional", "supplier"],
        required: true
      }
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = Conversation;
