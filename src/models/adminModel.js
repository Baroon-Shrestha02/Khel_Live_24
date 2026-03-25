import mongoose from "mongoose";
import validator from "validator";

const adminSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: [true, "Firstname is required"],
      trim: true,
      minlength: [3, "Firstname must be at least 3 characters"],
      maxlength: [30, "Firstname cannot exceed 30 characters"],
    },
    
    lastname: {
      type: String,
      required: [true, "Lastname is required"],
      trim: true,
      minlength: [3, "Lastname must be at least 3 characters"],
      maxlength: [30, "Lastname cannot exceed 30 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "Please provide a valid email"],

      email:{
        type:String,
        required:(true,"Email is required"),
        unique:true,
        lowercase:true,
        trim:true,
        validate:[validator.isEmail,"Please provide a valid email"]   
      }
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      maxlength: [10, "Phone number must be 10 digits"],
      validate: {
        validator: function (v) {
          return /^[0-9]+$/.test(v);
        },
        message: "Phone number must contain only digits",
      },
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true },
);

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;
