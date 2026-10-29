const tokenService = require("../jwt/token.service");
const User = require('../models/user.models');
const UserProfile = require("../models/user.profile.model");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

class UserService {
  async signup(name, email, password) {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new Error("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return user;
  }

  async loginUser(email, password) {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      throw new Error("User not found");
    }

    if (!user.isActive) {
      throw new Error("Your account is inactive. You cannot login.");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    const payload = {
      id: user._id,
      email: user.email,
      isActive: user.isActive,
    };

    const token = tokenService.generateToken(payload);

    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    return {
      user: userWithoutPassword,
      token,
    };
  }

  async getAllUsers() {
    return await User.find({ isActive: true }, { password: 0 }).populate(
      "profile",
    );
  }

  async softDeleteUser(id) {
    const user = await User.findById(id);

    if (!user) {
      throw new Error("User not found");
    }

    user.isActive = false;
    await user.save();

    return user;
  }

  async activateUser(id) {
    const user = await User.findById(id);

    if (!user) {
      throw new Error("User not found");
    }

    user.isActive = true;
    await user.save();

    return user;
  }

  async deleteUsers(email) {
    const user = await User.findOneAndUpdate(
      { email },
      { isActive: false },
      { new: true },
    ).select("-password");

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  async addUserProfile(userId, profileData) {
    if (!mongoose.isValidObjectId(userId)) {
      throw new Error("Invalid User Id");
    }

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const existingProfile = await UserProfile.findOne({
      user: userId,
    });

    if (existingProfile) {
      throw new Error("Profile already exists");
    }

    const userProfile = await UserProfile.create({
      user: userId,
      age: profileData.age,
      dob: profileData.dob,
      bio: profileData.bio,
    });

    user.profile = userProfile._id;
    await user.save();

    return userProfile;
  }

  async getUserProfile(userId) {
    if (!mongoose.isValidObjectId(userId)) {
      throw new Error("Invalid User Id");
    }

    const profile = await UserProfile.findOne({
      user: userId,
    }).populate("user", "-password");

    if (!profile) {
      throw new Error("Profile not found");
    }

    return profile;
  }

  async updateUserProfile(userId, profileData) {
    const profile = await UserProfile.findOneAndUpdate(
      { user: userId },
      profileData,
      { new: true },
    );

    if (!profile) {
      throw new Error("Profile not found");
    }

    return profile;
  }

  async deleteUserProfile(userId) {
    const profile = await UserProfile.findOneAndDelete({
      user: userId,
    });

    if (!profile) {
      throw new Error("Profile not found");
    }

    await User.findByIdAndUpdate(userId, {
      profile: null,
    });

    return profile;
  }
}

module.exports = new UserService();