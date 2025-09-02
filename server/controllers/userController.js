const Pdf = require("../models/Pdf");
const User = require("../models/User");
const cloudinary = require("cloudinary").v2;

const getFullProfile = async (req, res) => {
  //   const userId = req.params.id;

  const userId = "6891d415c8cd6309b50acd01";
  try {
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }

    const { userName, email, phoneNumber } = user;

    res.status(200).json({
      success: true,
      message: "user fetched successfully",
      user: {
        userName,
        email,
        phoneNumber,
      },
    });
  } catch (err) {
    console.log("Error: ", err);
    res.status(500).json({ message: "server error" });
  }
};

const deleteUser = async (req, res) => {
  //   const userId = req.params.id;

  const userId = "6896109b83442d030fe58df6";
  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }

    if (user.pdfs && user.pdfs.length > 0) {
      for (const pdf of user.pdfs) {
        if (pdf.cloudinaryPublicId) {
          await cloudinary.uploader.destroy(pdf.cloudinaryId, {
            resource_type: "raw",
          });
        }

        if (pdf._id) {
          await Pdf.findByIdAndDelete(pdf._id);
        }
      }
    }

    await User.findByIdAndDelete(userId);

    res
      .status(200)
      .json({ message: "User and all associated PDFs deleted", success: true });
  } catch (err) {
    console.log("error: ", err);
    res.status(500).json({ message: "server error" });
  }
};

const editUser = async (req, res) => {
  //   const userId = req.params.id;
  const userId = "6891d415c8cd6309b50acd01";

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    const { userName, email, phoneNumber } = req.body;

    // if(!userName || !email || !phoneNumber){
    //     return res.status(400).json({message:"All fields are required"})
    // }

    // Check if email is being changed
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(409).json({ message: "Email already in use" });
      }
      user.email = email;
    }

    // Check if email is being changed
    if (userName && userName !== user.userName) {
      const userNameExists = await User.findOne({ userName });
      if (userNameExists) {
        return res.status(409).json({ message: "userName already in use" });
      }
      user.userName = userName;
    }

    // Check if email is being changed
    if (phoneNumber && phoneNumber !== user.phoneNumber) {
      const phoneNumberExists = await User.findOne({ phoneNumber });
      if (phoneNumberExists) {
        return res.status(409).json({ message: "phoneNumber already in use" });
      }
      user.phoneNumber = phoneNumber;
    }

    // const newUser=new User({
    //     userName:userName,
    //     email:email,
    //     phoneNumber:phoneNumber
    // })

    const updatedUser = await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        userId: updatedUser._id,
        userName: updatedUser.userName,
        email: updatedUser.email,
        phoneNumber: updatedUser.phoneNumber,
      },
    });
  } catch (err) {
    console.log("Error: ", err);
    res.status(500).json({ message: "server error" });
  }
};

const getAverageProgress = async (req, res) => {
  try {
    const id = req.user?.id;
    const docs = await Pdf.find({ user: id });

    if (!docs.length) {
      return res.json({ averageProgress: 0 });
    }

    // calculate progress for each doc
    // const progresses = docs.map((doc) =>
    //   doc.totalPages > 0 ? (doc.currentPage / doc.totalPages) * 100 : 0
    // );
    const progresses = docs.map((doc) => doc.progress || 0);

    // average progress
    const averageProgress =
      progresses.reduce((a, b) => a + b, 0) / progresses.length;

    res.status(200).json({ averageProgress });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getFullProfile, deleteUser, editUser, getAverageProgress };
