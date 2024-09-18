import jwt from "jsonwebtoken";
import { google } from "googleapis";
import { generateAccessAndRefreshToken } from "./user.controllers.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import {
  parseAlternativePayload,
  parseMixedPayload,
  decodeBase64Url,
} from "../utils/mimeHandler.js";
let options = {
  httpOnly: true,
  secure: true,
};

// Handle Google callback
export const googleCallback = (req, res) => {
  if (req.user) {
    const googleAuthToken = jwt.sign(
      { googleId: req.user.googleId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "24h" }
    );

    res.cookie("googleAuthToken", googleAuthToken, options);
    res.redirect(process.env.CLIENT_URL);
  }
};

export const registerSuccess = async (req, res) => {
  if (req.user) {
    const id = req.user.id;

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      id
    );

    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        success: true,
        error: false,
        message: "You have successfully registered",
        user: req.user,
      });
  } else {
    res.status(401).json({
      error: true,
      message: "Registration failed",
    });
  }
};

// Get Gmail client
export const getGmailClient = async (user) => {
  // console.log("User in gmail client::", user);

  const oauth2Client = new google.auth.OAuth2(
    process.env.OAUTH_CLIENT_ID,
    process.env.OAUTH_CLIENT_SECRET,
    "/api/v1/oauth/google/callback"
  );

  if (!user?.accessToken || !user?.refreshToken) {
    throw new ApiError(409, "Access token or refresh token is missing.");
  }

  oauth2Client.setCredentials({
    access_token: user?.accessToken,
    refresh_token: user?.refreshToken,
  });

  console.log("Getting Gmail Client Successful");

  return google.gmail({ version: "v1", auth: oauth2Client });
};

// parsing text/plain
const parseText = async (payload) => {
  const Emaildata = {
    subject: "",
    to: "",
    from: "",
    body: {
      text: "",
    },
  };

  const decodedText = await decodeBase64Url(payload?.body?.data);
  Emaildata.body.text = decodedText ? decodedText : "";
  Emaildata.subject = payload.headers.find(
    (header) => header.name === "Subject"
  ).value;
  Emaildata.from = payload.headers.find(
    (header) => header.name === "From"
  ).value;
  Emaildata.to = payload.headers.find((header) => header.name === "To").value;

  return Emaildata;
};

//Fetch Email by id
export const viewMail = async (req, res) => {
  const id = req.params.id;

  const gmail = await getGmailClient(req.user);
  const messageData = await gmail.users.messages.get({
    userId: "me",
    id: id,
  });
  let Emaildata = [];

  if (messageData.data.payload.mimeType === "multipart/alternative") {
    Emaildata = await parseAlternativePayload(messageData.data.payload);
  } else if (messageData.data.payload.mimeType === "multipart/mixed") {
    Emaildata = await parseMixedPayload(messageData.data.payload);
  } else if (messageData.data.payload.mimeType === "text/plain") {
    Emaildata = await parseText(messageData.data.payload);
  }

  res.status(200).json(Emaildata);
};

// Fetch inbox
export const getInbox = async (req, res) => {
  try {
    const gmail = await getGmailClient(req.user);
    const response = await gmail.users.messages.list({
      userId: "me",
      maxResults: 20,
      q: "label:INBOX",
    });

    const threadList = response?.data.messages;
    if (!threadList || threadList.length === 0) {
      throw new ApiError(404, "No messages found.");
    }

    let Emaildata = [];
    const messageDetails = await Promise.all(
      threadList.map(async (message) => {
        const inboxdata = await gmail.users.messages.get({
          userId: "me",
          id: message.id,
        });

        if (inboxdata.data.payload.mimeType === "multipart/alternative") {
          Emaildata = await parseAlternativePayload(inboxdata.data.payload);
          Emaildata.id = message.id;
        } else if (inboxdata.data.payload.mimeType === "multipart/mixed") {
          Emaildata = await parseMixedPayload(inboxdata.data.payload);
          Emaildata.id = message.id;
        } else if (inboxdata.data.payload.mimeType === "text/plain") {
          Emaildata = await parseText(inboxdata.data.payload);
          Emaildata.id = message.id;
        }
        // console.log(Emaildata);
        console.log("fetched inbox messages successfull");
        return Emaildata;
      })
    );

    res.status(200).json(messageDetails);
  } catch (error) {
    console.error("Error fetching inbox:", error);
    res.status(500).json({ error: "Failed to fetch inbox" });
  }
};
// Fetch Sent Email
export const getSentEmail = async (req, res) => {
  try {
    const gmail = await getGmailClient(req.user);
    const response = await gmail.users.messages.list({
      userId: "me",
      maxResults: 20,
      q: "label:SENT",
    });

    const threadList = response?.data?.messages;
    // console.log(threadList);

    if (!threadList || threadList.length === 0) {
      throw new ApiError(404, "No messages found.");
    }

    let Emaildata = [];
    const messageDetails = await Promise.all(
      threadList.map(async (message) => {
        const sentData = await gmail.users.messages.get({
          userId: "me",
          id: message?.id,
        });

        // console.log(sentData);

        if (sentData.data.payload.mimeType === "multipart/alternative") {
          Emaildata = await parseAlternativePayload(sentData.data.payload);
          Emaildata.id = message.id;
        } else if (sentData.data.payload.mimeType === "multipart/mixed") {
          Emaildata = await parseMixedPayload(sentData.data.payload);
          Emaildata.id = message.id;
        } else if (sentData.data.payload.mimeType === "text/plain") {
          Emaildata = await parseText(sentData.data.payload);
          Emaildata.id = message.id;
        }

        return Emaildata;
      })
    );
    console.log("sent messages successfull");
    res.json(messageDetails);
  } catch (error) {
    console.error("Error fetching sent email:", error);
    res.status(500).json({ error: "Failed to fetch sent messages" });
  }
};

// Send email
export const sendEmail = async (req, res) => {
  try {
    console.log("Send email started");
    // console.log("USER:::", req.user);

    const gmail = await getGmailClient(req.user);
    // console.log("REQ  BODY:::", req.body);

    const { toEmail: to, subject, message: body } = req.body;

    const message = [`To: ${to}`, `Subject: ${subject}`, "", body].join("\n");

    const encodedMessage = Buffer.from(message)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
    console.log("Encoded message:", encodedMessage);

    const response = await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: encodedMessage,
      },
    });
    console.log("Response:", response);

    res
      .status(200)
      .json(new ApiResponse(200, response.data, "Mail Sent Successfully"));
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
};
