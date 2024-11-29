const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation",
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },

  messageType: {
    type: String,
    enum: ["text", "negotiation", "system"],
    default: "text",
  },

  //   metadata: {
  //     negotiation: {
  //       type: {
  //         type: String,
  //         enum: ["update", "response", "final"],
  //       },
  //       negotiationId: {
  //         type: mongoose.Schema.Types.ObjectId,
  //         ref: "Negotiation",
  //       },
  //       round: {
  //         type: Number,
  //       },
  //       changes: {
  //         budget: Number,
  //         deadline: Date,
  //         notes: String,
  //       },
  //       response: {
  //         type: String,
  //         enum: ["accepted", "rejected", "pending"],
  //       },
  //     },
  //   },

  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
