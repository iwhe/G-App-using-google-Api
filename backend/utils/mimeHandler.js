// Function to decode base64Url encoded strings
export const decodeBase64Url = async (base64Url) => {
  return await Buffer.from(base64Url, "base64url").toString("utf-8");
};

// Function to extract and parse parts from multipart/alternative
export const parseAlternativePayload = async (payload) => {
  // console.log("parsing multipart/alternative");
  let emailBody = {
    subject: null,
    from: null,
    to: null,
    body: {
      text: null,
      html: null,
    },
  };
  const subjectHeader = payload.headers.find(
    (header) => header.name === "Subject"
  );
  const fromHeader = payload.headers.find((header) => header.name === "From");

  const subject = subjectHeader ? subjectHeader.value : "No Subject";
  emailBody.subject = subject;

  const from = fromHeader ? fromHeader.value : "No Sender";
  emailBody.from = from;

  const toHeader = payload.headers.find((header) => header.name === "To");
  const to = toHeader ? toHeader.value : "No Receiver";
  emailBody.to = to;

  try {
    if (!payload.parts || !Array.isArray(payload.parts)) {
      console.error("Invalid payload structure: Missing parts array.");
      return emailBody;
    }

    for (const part of payload.parts) {
      if (part.mimeType === "text/plain") {
        const decodedText = await decodeBase64Url(part.body.data);
        emailBody.body.text = decodedText;
      } else if (part.mimeType === "text/html") {
        const decodedHTML = await decodeBase64Url(part.body.data);
        emailBody.body.html = decodedHTML;
      } else {
        (emailBody.body = {
          type: part.mimeType,
          content: "Unhandled MIME type",
        }),
          console.log(`Unhandled MIME type: ${part.mimeType}`);
      }
    }
  } catch (error) {
    console.log("Error while parsing alternative type Email Content", error);
  } finally {
    return emailBody;
  }
};

// Function to extract and parse parts from multipart/mixed
export const parseMixedPayload = async (payload) => {
  // console.log("parsing multipart/mixed");
  let emailBody = {
    subject: null,
    from: null,
    to: null,
    body: {
      text: null,
      html: null,
      attachments: {
        pdf: {
          data: null,
          filename: null,
        },
        images: [],
        video: {
          data: null,
          title: null,
        },
      },
    },
  };
  const subjectHeader = payload.headers.find(
    (header) => header.name === "Subject"
  );
  const fromHeader = payload.headers.find((header) => header.name === "From");

  const subject = subjectHeader ? subjectHeader.value : "No Subject";
  emailBody.subject = subject;

  const from = fromHeader ? fromHeader.value : "No Sender";
  emailBody.from = from;

  const toHeader = payload.headers.find((header) => header.name === "To");
  const to = toHeader ? toHeader.value : "No Receiver";
  emailBody.to = to;

  try {
    if (!payload.parts || !Array.isArray(payload.parts)) {
      console.error("Invalid payload structure: Missing parts array.");
      return;
    }

    for (const part of payload.parts) {
      const { mimeType, body, filename, parts } = part;
      switch (mimeType) {
        case "multipart/alternative":
          for (const altPart of parts) {
            //text/plain
            if (altPart.mimeType === "text/plain") {
              const plainText = decodeBase64Url(altPart.body.data);
              emailBody.body.text = plainText;
            }
            //text/html
            else if (altPart.mimeType === "text/html") {
              const htmlText = decodeBase64Url(altPart.body.data);
              emailBody.body.html = htmlText;
            }
          }
          break;

        case "application/pdf":
          emailBody.body.attachments.pdf.data = Buffer.from(
            body.attachmentId,
            "base64"
          );
          emailBody.body.attachments.pdf.filename = filename;
          break;

        case "image/png":
        case "image/jpeg":
        case "image/jpg":
        case "image/gif":
          emailBody.body.attachments.images = emailBody.body.images || [];
          emailBody.body.attachments.images.push({
            type: mimeType,
            filename: filename,
            data: Buffer.from(body.attachmentId, "base64"),
          });
          break;

        case "video/mp4":
          emailBody.body.attachments.video.data = Buffer.from(
            body.attachmentId,
            "base64"
          );
          emailBody.body.attachments.video.title = filename;
          break;

        case "multipart/related":
          for (const altPart of parts) {
            //text/plain
            console.log("mimeType: multipart/related");

            if (altPart.mimeType === "text/plain") {
              const plainText = decodeBase64Url(altPart.body.data);
              emailBody.body.text = plainText;
            }
            //text/html
            else if (altPart.mimeType === "text/html") {
              const htmlText = decodeBase64Url(altPart.body.data);
              emailBody.body.html = htmlText;
            }
            //images
            else if (
              altPart.mimeType === "image/png" ||
              "image/jpeg" ||
              "image/jpg" ||
              "image/gif"
            ) {
              emailBody.body.attachments.images = emailBody.body.images || [];
              emailBody.body.attachments.images.push({
                type: mimeType,
                filename: filename,
                data: Buffer.from(body.attachmentId, "base64"),
              });
            }
            break;
          }
          break;

        default:
          console.log(`Unhandled MIME type: ${mimeType}`);
          break;
      }
    }
  } catch (error) {
    console.error("Error parsing mixed payload:", error);
  } finally {
    return emailBody;
  }
};
