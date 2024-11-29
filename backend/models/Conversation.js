const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],

  status: {
    type: String,
    enum: ["proposal", "accepted", "rejected"],
    default: "proposal",
  },

  //   serviceId: {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "Service",
  //     required: false,
  //   },

  //   projectId: {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "Project",
  //     default: null,
  //   },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = Conversation;
