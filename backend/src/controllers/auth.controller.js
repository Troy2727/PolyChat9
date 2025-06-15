import { upsertStreamUser } from "../lib/stream.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { verifyFirebaseToken, createCustomToken } from "../lib/firebase-admin.js";
import { generateRandomAvatar } from "../lib/firebase-storage.js";
import axios from "axios";
import fs from "fs";

export async function signup(req, res) {
  const { email, password, fullName } = req.body;

  try {
    if (!email || !password || !fullName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists, please use a diffrent one" });
    }

    const randomAvatar = generateRandomAvatar();

    const newUser = await User.create({
      email,
      fullName,
      password,
      profilePic: randomAvatar, // Keep for backward compatibility
      randomAvatarUrl: randomAvatar,
      avatarUrl: "", // No uploaded avatar initially
    });

    try {
      await upsertStreamUser({
        id: newUser._id.toString(),
        name: newUser.fullName,
        image: newUser.avatarUrl || newUser.randomAvatarUrl || newUser.profilePic || "",
      });
      console.log(`Stream user created for ${newUser.fullName}`);
    } catch (error) {
      console.log("Error creating Stream user:", error);
    }

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true, // prevent XSS attacks,
      sameSite: "strict", // prevent CSRF attacks
      secure: process.env.NODE_ENV === "production",
    });

    res.status(201).json({ success: true, user: newUser });
  } catch (error) {
    console.log("Error in signup controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    const isPasswordCorrect = await user.matchPassword(password);
    if (!isPasswordCorrect) return res.status(401).json({ message: "Invalid email or password" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true, // prevent XSS attacks,
      sameSite: "strict", // prevent CSRF attacks
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export function logout(req, res) {
  res.clearCookie("jwt");
  res.status(200).json({ success: true, message: "Logout successful" });
}

export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if user exists or not for security
      return res.status(200).json({
        success: true,
        message: "If an account with that email exists, we've sent a password reset link."
      });
    }

    // TODO: Implement actual password reset token generation and email sending
    // For now, just return success
    console.log(`Password reset requested for: ${email}`);

    res.status(200).json({
      success: true,
      message: "If an account with that email exists, we've sent a password reset link."
    });
  } catch (error) {
    console.log("Error in forgotPassword controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function resetPassword(req, res) {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: "Token and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // TODO: Implement actual password reset token verification and password update
    // For now, just return success
    console.log(`Password reset attempted with token: ${token}`);

    res.status(200).json({
      success: true,
      message: "Password has been reset successfully"
    });
  } catch (error) {
    console.log("Error in resetPassword controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function onboard(req, res) {
  try {
    const userId = req.user._id;

    const { fullName, bio, nativeLanguage, learningLanguage, location } = req.body;

    if (!fullName || !bio || !nativeLanguage || !learningLanguage || !location) {
      return res.status(400).json({
        message: "All fields are required",
        missingFields: [
          !fullName && "fullName",
          !bio && "bio",
          !nativeLanguage && "nativeLanguage",
          !learningLanguage && "learningLanguage",
          !location && "location",
        ].filter(Boolean),
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...req.body,
        isOnboarded: true,
      },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    try {
      await upsertStreamUser({
        id: updatedUser._id.toString(),
        name: updatedUser.fullName,
        image: updatedUser.avatarUrl || updatedUser.randomAvatarUrl || updatedUser.profilePic || "",
      });
      console.log(`Stream user updated after onboarding for ${updatedUser.fullName}`);
    } catch (streamError) {
      console.log("Error updating Stream user during onboarding:", streamError.message);
    }

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Onboarding error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function updateProfile(req, res) {
  try {
    const userId = req.user._id;
    const { fullName, bio, nativeLanguage, learningLanguage, location, profilePic } = req.body;

    // Validate required fields
    if (!fullName) {
      return res.status(400).json({ message: "Full name is required" });
    }

    // Prepare update object
    const updateData = {
      fullName,
      bio: bio || "",
      nativeLanguage: nativeLanguage || "",
      learningLanguage: learningLanguage || "",
      location: location || "",
    };

    // Only update profilePic if provided (for backward compatibility)
    if (profilePic !== undefined) {
      updateData.profilePic = profilePic;
      // If it's a random avatar, also update randomAvatarUrl
      if (profilePic && profilePic.includes('avatar.iran.liara.run')) {
        updateData.randomAvatarUrl = profilePic;
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update Stream user
    try {
      await upsertStreamUser({
        id: updatedUser._id.toString(),
        name: updatedUser.fullName,
        image: updatedUser.avatarUrl || updatedUser.randomAvatarUrl || updatedUser.profilePic || "",
      });
      console.log(`Stream user updated for ${updatedUser.fullName}`);
    } catch (streamError) {
      console.log("Error updating Stream user:", streamError.message);
    }

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Firebase Authentication Endpoints

export async function firebaseSignIn(req, res) {
  try {
    console.log('Firebase sign-in request received');
    console.log('Request body:', req.body);

    const { idToken, fullName, profilePic } = req.body;

    if (!idToken) {
      console.log('No idToken provided');
      return res.status(400).json({ message: "Firebase ID token is required" });
    }

    console.log('idToken received, proceeding with verification');

    // Verify Firebase token
    const { user: firebaseUser, error: verifyError } = await verifyFirebaseToken(idToken);
    if (verifyError) {
      return res.status(401).json({ message: "Invalid Firebase token" });
    }

    const { email, uid, name, picture } = firebaseUser;
    console.log('Firebase user verified:', { email, uid, name });
    console.log('Full Firebase user object:', firebaseUser);

    // Handle missing email (common with Twitter authentication)
    let userEmail = email;
    if (!userEmail) {
      // For Twitter and other providers that don't provide email,
      // we'll use the Firebase UID as a unique identifier
      userEmail = `${uid}@firebase.local`;
      console.log('No email provided, using fallback:', userEmail);
    }

    // Check if user exists in our database
    console.log('Checking if user exists in database...');
    let user = await User.findOne({
      $or: [
        { email: userEmail },
        { firebaseUid: uid }
      ]
    });
    console.log('User found in database:', !!user);

    if (!user) {
      // Create new user
      console.log('Creating new user...');
      const defaultAvatar = generateRandomAvatar();

      const userData = {
        email: userEmail,
        fullName: fullName || name || userEmail.split('@')[0],
        password: uid, // Use Firebase UID as password placeholder
        profilePic: profilePic || picture || defaultAvatar, // Keep for backward compatibility
        randomAvatarUrl: defaultAvatar,
        avatarUrl: (profilePic && !profilePic.includes('avatar.iran.liara.run')) ? (profilePic || picture || "") : "",
        firebaseUid: uid,
        authProvider: 'firebase'
      };

      console.log('User data to create:', userData);
      user = await User.create(userData);
      console.log('User created successfully:', user._id);

      // Create Stream user (non-blocking)
      try {
        await upsertStreamUser({
          id: user._id.toString(),
          name: user.fullName,
          image: user.avatarUrl || user.randomAvatarUrl || user.profilePic || "",
        });
        console.log(`Stream user created for ${user.fullName}`);
      } catch (streamError) {
        console.log("Error creating Stream user (non-critical):", streamError.message);
        // Don't fail authentication if Stream Chat fails
      }
    } else {
      // Update existing user with Firebase UID if not set
      if (!user.firebaseUid) {
        user.firebaseUid = uid;
        user.authProvider = 'firebase';
        await user.save();
      }
    }

    // Generate JWT token for our backend
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("Error in Firebase sign-in controller", error.message);
    console.log("Full error details:", error);
    console.log("Error stack:", error.stack);

    // Write error to file for debugging
    const errorLog = `
=== Firebase Sign-in Error ===
Time: ${new Date().toISOString()}
Message: ${error.message}
Stack: ${error.stack}
Full Error: ${JSON.stringify(error, null, 2)}
===============================
`;
    fs.appendFileSync('firebase-error.log', errorLog);

    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function linkedInExchange(req, res) {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ message: "LinkedIn authorization code is required" });
    }

    // Exchange code for access token
    const tokenResponse = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', {
      grant_type: 'authorization_code',
      code,
      redirect_uri: `${process.env.FRONTEND_URL}/auth/linkedin/callback`,
      client_id: process.env.LINKEDIN_CLIENT_ID,
      client_secret: process.env.LINKEDIN_CLIENT_SECRET,
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const { access_token } = tokenResponse.data;

    // Get user profile from LinkedIn
    const profileResponse = await axios.get('https://api.linkedin.com/v2/people/~:(id,firstName,lastName,profilePicture(displayImage~:playableStreams))', {
      headers: {
        'Authorization': `Bearer ${access_token}`,
      },
    });

    const emailResponse = await axios.get('https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))', {
      headers: {
        'Authorization': `Bearer ${access_token}`,
      },
    });

    const profile = profileResponse.data;
    const email = emailResponse.data.elements[0]['handle~'].emailAddress;
    const fullName = `${profile.firstName.localized.en_US} ${profile.lastName.localized.en_US}`;
    const profilePic = profile.profilePicture?.['displayImage~']?.elements?.[0]?.identifiers?.[0]?.identifier;

    // Create custom Firebase token
    const uid = `linkedin_${profile.id}`;
    const { token: customToken, error: tokenError } = await createCustomToken(uid, {
      email,
      name: fullName,
      picture: profilePic,
      provider: 'linkedin'
    });

    if (tokenError) {
      return res.status(500).json({ message: "Failed to create custom token" });
    }

    res.status(200).json({
      success: true,
      customToken,
      userInfo: { email, fullName, profilePic }
    });
  } catch (error) {
    console.log("Error in LinkedIn exchange controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
