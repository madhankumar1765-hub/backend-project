const userService = require("../services/user.service");

class UserController {
  async signup(req, res) {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({
          message: "All fields are required",
        });
      }

      const user = await userService.signup(name, email, password);

      return res.status(201).json({
        message: "User created successfully",
        user,
      });
    } catch (err) {
      return res.status(409).json({
        message: err.message,
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      const data = await userService.loginUser(email, password);

      return res.status(200).json(data);
    } catch (err) {
      return res.status(401).json({
        message: err.message,
      });
    }
  }

  async getAllUsers(req, res) {
    try {
      const users = await userService.getAllUsers();

      return res.status(200).json({
        message: "Users fetched successfully",
        users,
      });
    } catch (err) {
      return res.status(500).json({
        message: err.message,
      });
    }
  }

  async softDeleteUser(req, res) {
    try {
      const user = await userService.softDeleteUser(req.params.id);

      return res.status(200).json({
        message: "User deleted successfully",
        user,
      });
    } catch (err) {
      return res.status(404).json({
        message: err.message,
      });
    }
  }

  async activateUser(req, res) {
    try {
      const user = await userService.activateUser(req.params.id);

      return res.status(200).json({
        message: "User activated successfully",
        user,
      });
    } catch (err) {
      return res.status(404).json({
        message: err.message,
      });
    }
  }

  async addUserProfile(req, res) {
    try {
      const profile = await userService.addUserProfile(req.params.id, req.body);

      return res.status(201).json({
        message: "Profile added successfully",
        profile,
      });
    } catch (err) {
      return res.status(400).json({
        message: err.message,
      });
    }
  }

  async getUserProfile(req, res) {
    try {
      const profile = await userService.getUserProfile(req.params.id);

      return res.status(200).json(profile);
    } catch (err) {
      return res.status(404).json({
        message: err.message,
      });
    }
  }

  async updateUserProfile(req, res) {
    try {
      const profile = await userService.updateUserProfile(
        req.params.id,
        req.body,
      );

      return res.status(200).json({
        message: "Profile updated successfully",
        profile,
      });
    } catch (err) {
      return res.status(400).json({
        message: err.message,
      });
    }
  }

  async deleteUserProfile(req, res) {
    try {
      await userService.deleteUserProfile(req.params.id);

      return res.status(200).json({
        message: "Profile deleted successfully",
      });
    } catch (err) {
      return res.status(404).json({
        message: err.message,
      });
    }
  }
}

module.exports = new UserController();