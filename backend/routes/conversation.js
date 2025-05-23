const express = require("express");
const router = express.Router();
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const authMiddleware = require("../middlewares/auth");
const User = require("../models/User");
const Professional = require("../models/Professional");
const Supplier = require("../models/Supplier");

router.use(authMiddleware);

router.get("/anotherTestEndpoint", (req, res) => {
  res.json({ messag: "Well, so, here is another one" });
});

router.get("/check-conversation/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const conversation = await Conversation.exists({
      participants: { $in: [userId] },
    });

    res.json({
      exists: !!conversation,
    });
  } catch (error) {
    console.error("Error checking conversation:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

router.get("/test", async (req, res) => {
  console.log("Test route called");
  res.status(200).json({ message: "Test route" });
});

router.post("/", async (req, res) => {
  try {
    const { participant, userType } = req.body;
    // console.log("User ID coming from conversations api route: ", req.user);

    console.log(
      "Participant and userType in conversations api route: ",
      participant,
      userType
    );

    const conversation = new Conversation({
      participants: [
        { user: req.user._id, userType: "homeowner" },
        { user: participant, userType: userType },
      ],
    });
    await conversation.save();

    // const { budget, deadline } = req.body.proposal;

    // const proposal = new Proposal({
    //   conversationId: conversation._id,
    //   budget: budget,
    //   deadline: deadline,
    // });
    // await proposal.save();

    res.status(201).json(conversation);
  } catch (error) {
    console.error("Error creating conversation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/getConversation/:conversationId", async (req, res) => {
  try {
    const conversationId = req.params.conversationId;
    console.log(
      "Fetching conversation in conversation api route",
      conversationId
    );
    const conversation = await Conversation.findById(conversationId).populate({
      path: "participants.user",
      select: "name",
    });
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }
    res.json(conversation);
  } catch (error) {
    console.error("Error fetching conversation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:conversationId/proposal", async (req, res) => {
  try {
    const conversationId = req.params.conversationId;
    const proposal = await Proposal.findOne({ conversationId });
    res.json(proposal);
  } catch (error) {
    console.error("Error fetching proposal:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:conversationId/messages", async (req, res) => {
  try {
    const { conversationId } = req.params;
    console.log(
      "Conversation ID in messages api endpoint(New): ",
      conversationId
    );
    const messages = await Message.find({ conversationId });
    // console.log("Messages in messages api endpoint(New): ", messages);
    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:userType", authMiddleware, async (req, res) => {
  try {
    const userType = req.params.userType;

    let userId;

    if (userType === "homeowner") {
      userId = req.user._id;
    } else if (userType === "professional") {
      const professional = await Professional.findOne({ userId: req.user._id });
      userId = professional._id;
    } else if (userType === "supplier") {
      const supplier = await Supplier.findOne({ userId: req.user._id });
      userId = supplier._id;
    }

    const conversations = await Conversation.aggregate([
      { $match: { "participants.user": userId } },
      {
        $lookup: {
          from: "messages",
          let: { conversationId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$conversationId", "$$conversationId"] },
              },
            },
            { $sort: { timestamp: -1 } },
            { $limit: 1 },
          ],
          as: "lastMessage",
        },
      },
      {
        $addFields: {
          lastMessage: { $arrayElemAt: ["$lastMessage", 0] },
        },
      },
      {
        $lookup: {
          from: "professionals",
          let: { participants: "$participants" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: [
                    "$_id",
                    {
                      $map: {
                        input: {
                          $filter: {
                            input: "$$participants",
                            as: "participant",
                            cond: {
                              $eq: ["$$participant.userType", "professional"],
                            },
                          },
                        },
                        as: "participant",
                        in: "$$participant.user",
                      },
                    },
                  ],
                },
              },
            },
            {
              $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "userData",
              },
            },
            {
              $addFields: {
                userData: { $arrayElemAt: ["$userData", 0] },
              },
            },
          ],
          as: "professionalData",
        },
      },
      {
        $lookup: {
          from: "suppliers",
          let: { participants: "$participants" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: [
                    "$_id",
                    {
                      $map: {
                        input: {
                          $filter: {
                            input: "$$participants",
                            as: "participant",
                            cond: {
                              $eq: ["$$participant.userType", "supplier"],
                            },
                          },
                        },
                        as: "participant",
                        in: "$$participant.user",
                      },
                    },
                  ],
                },
              },
            },
            {
              $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "userData",
              },
            },
            {
              $addFields: {
                userData: { $arrayElemAt: ["$userData", 0] },
              },
            },
          ],
          as: "supplierData",
        },
      },
      {
        $lookup: {
          from: "users",
          let: { participants: "$participants" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: [
                    "$_id",
                    {
                      $map: {
                        input: {
                          $filter: {
                            input: "$$participants",
                            as: "participant",
                            cond: {
                              $eq: ["$$participant.userType", "homeowner"],
                            },
                          },
                        },
                        as: "participant",
                        in: "$$participant.user",
                      },
                    },
                  ],
                },
              },
            },
          ],
          as: "homeownerData",
        },
      },
      {
        $addFields: {
          participants: {
            $concatArrays: [
              {
                $map: {
                  input: "$homeownerData",
                  as: "homeowner",
                  in: {
                    _id: "$$homeowner._id",
                    name: "$$homeowner.name",
                    email: "$$homeowner.email",
                    userType: "homeowner",
                    profilePictureUrl: "$$homeowner.profilePictureUrl",
                    createdAt: "$$homeowner.createdAt",
                  },
                },
              },
              {
                $map: {
                  input: "$professionalData",
                  as: "professional",
                  in: {
                    $mergeObjects: [
                      {
                        _id: "$$professional._id",
                        userId: "$$professional.userId",
                        name: "$$professional.userData.name",
                        email: "$$professional.userData.email",
                        userType: "professional",
                        profilePictureUrl:
                          "$$professional.userData.profilePictureUrl",
                        createdAt: "$$professional.createdAt",
                      },
                      {
                        serviceType: "$$professional.serviceType",
                        yearsExperience: "$$professional.yearsExperience",
                        rating: "$$professional.rating",
                        ratePerHour: "$$professional.ratePerHour",
                        bio: "$$professional.bio",
                      },
                    ],
                  },
                },
              },
              {
                $map: {
                  input: "$supplierData",
                  as: "supplier",
                  in: {
                    $mergeObjects: [
                      {
                        _id: "$$supplier._id",
                        userId: "$$supplier.userId",
                        name: "$$supplier.userData.name",
                        email: "$$supplier.userData.email",
                        userType: "supplier",
                        profilePictureUrl:
                          "$$supplier.userData.profilePictureUrl",
                        createdAt: "$$supplier.createdAt",
                      },
                      {
                        businessName: "$$supplier.businessName",
                        businessType: "$$supplier.businessType",
                        businessDescription: "$$supplier.businessDescription",
                        logo: "$$supplier.logo",
                        rating: "$$supplier.rating",
                        isVerified: "$$supplier.isVerified",
                      },
                    ],
                  },
                },
              },
            ],
          },
        },
      },
    ]);
    res.json(conversations);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
