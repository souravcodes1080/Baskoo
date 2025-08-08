import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
    category: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Category",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const SubCategory = mongoose.model("Category", subCategorySchema);
export default SubCategory;
