const { Schema, model } = require("mongoose");

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    content: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      required: false,
    },
    author: { type: Schema.Types.ObjectId, ref: "User" },
    //date: { type: Date, default: Date.now },
    categories: [{ type: Schema.Types.ObjectId, ref: "Category" }],
  },

  { timestamps: true }
);

module.exports = model("Post", postSchema);
