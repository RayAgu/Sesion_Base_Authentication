const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const userModel = require("../models/userModel");

// Sign up a new user
exports.signUp = async( req, res ) => {
    try {
        const { username, email, password } = req.body;

        // check if the email is already registered
        const existingUser = await userModel.findOne({ email });
        if(existingUser) {
            return res.status(400).json({message: 'Email already registered'});
        }

        // salt the password
        const saltedpassword = await bcrypt.genSalt( 10 );
        // Hash the password
        const hashedPasword = await bcrypt.hash(password, saltedpassword);

        // Create a new user
        const user = new userModel({
            username,
            email,
            password: hashedPasword,
            // records: [],
        });

        // Save the user to the database
        await user.save();

        res.status(201).json({
            message: 'User successfully created',
        });
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: error.message
        })
    }
}

// Sign in an existing user
exports.signIn = async( req, res ) =>{
    try {
        const { email, password } = req.body;

        // Check if the user exists
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials"});
        }

        // Compare the password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Set user session 
        req.session.user = user;

        res.status(200).json({
            message: "User signed in successfully",
            user
        })
    } catch (error){
        console.error(error)
        res.status(500).json({
            message:"Internal server error"
        })
    }
};

// sign out the currently signed-in user
exports.signOut = (req, res) =>{
    // destroy the session
    req.session.destroy();
    res.status(200).json({ message: "User signed out successfully" });
};

//all users
exports.allUsers = async( req, res ) => {
    try {
        const alUsers = await userModel.find();

        res.status(200).json({
            message: "All users",
            data: alUsers
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}