const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        logo: {
            type: String,
            default: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?q=80&w=1476&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        coverImage: {
            type: String,
            default: "",
        },
        businessName: {
            type: String,
            required: false,
            index: true,
            default: "Business name"
        },
        businessDescription: {
            type: String,
            default: "Business description",

        },
        businessType: {
            type: String,
            enum: ["manufacturer", "distributor", "retailer", "wholesaler"],
            required: false,
            default: "retailer"
        },
        businessRegistration: {
            number: String,
            document: String,
        },
        contact: {
            phone: {type: String},
            website: {type: String},
            socialMedia: {
                facebook: String,
                linkedin: String,
                instagram: String,
            },
        },
        address: {
            type: String,
            required: false
        },
        listings: [{type: mongoose.Schema.Types.ObjectId, ref: "Listing"}],
        certifications: [String],
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        reviews: [
            {
                user: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
                comment: String,
                image: [String],
                rating: Number,
                createdAt: Date,
            },
        ],
        isVerified: {
            type: Boolean,
            default: false,
        },
        paymentTerms: {
            type: String,
            enum: ["advance", "credit", "partial"],
        },
        deliveryOptions: {
            type: [String],
            enum: ["pickup", "local_delivery", "national_shipping"],
        },
    },
    {
        timestamps: true
    }
);

module.exports =
    mongoose.models.Supplier || mongoose.model("Supplier", supplierSchema);
