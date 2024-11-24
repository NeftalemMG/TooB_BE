import mongoose from "mongoose";
import bycrypt from 'bcryptjs';



const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Name is required"],
		},
		email: {
			type: String,
			required: [true, "Email is required"],
			unique: true,
			lowercase: true,
			trim: true,
		},
		password: {
			type: String,
			required: [true, "Password is required"],
			minlength: [6, "Password must be at least 6 characters long"],
		},
		cartItems: [
			{
				quantity: {
					type: Number,
					default: 1,
				},
				product: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Product",
				},
			},
		],
		role: {
			type: String,
			enum: ["customer", "admin"],
			default: "customer",
		},
	},
	{
		timestamps: true,
	}
);


// pre hook that makes the password to be hashed when they are stored in the db
userSchema.pre('save', async function (next) {
    if(!this.isModified('password')) return next();

    try {
        const salt = await bycrypt.genSalt(10);
        this.password = await bycrypt.hash(this.password, salt)
        next();
    } catch (error) {
        next(error);
    }
    
});

// methods added to each instance for comparing the password and hash
userSchema.methods.comparePassword = async function (password) {
    return bycrypt.compare(password, this.password);
}


const User = mongoose.model("User", userSchema);
export default User;
