import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEmailById } from "../../services/email";
import { useParams } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";
import { GoDownload } from "react-icons/go";

const ViewEmail = () => {
  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(false);
  const id = useParams().id;
  console.log(id);

  useEffect(() => {
    try {
      const fetchEmail = async (id) => {
        // console.log("fetch email", id);
        setLoading(true);
        const response = await getEmailById(id);
        // console.log("Response", response);
        if (response) {
          setEmail(response.data);
        }
      };
      fetchEmail(id);
    } catch (error) {
      console.log("Error while fetching email", error);
    } finally {
      setLoading(false);
      // console.log("Email", email);
    }
  }, []);

  const navigate = useNavigate();

  const downloadFile = (filename, content, mimeType) => {
    const blob = new Blob([new Uint8Array(content)], { type: mimeType });
    const link = document.createElement("a");
    const url = window.URL.createObjectURL(blob);

    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-screen h-screen bg-blue-100 p-4 ">
      <div className="rounded-xl bg-[#FEFCFF] overflow-hidden">
        <div className="topbar w-full h-auto py-4 bg-gray-200 text-left px-4 text-xl">
          <IoMdArrowBack
            onClick={() => navigate("/mail")}
            className="hover:bg-white rounded-full "
          />
        </div>
        {email && (
          <div className="emailDetails my-4 py-2 mx-8">
            <div className="emailSubject text-2xl font-medium text-left border-b border-zinc-300">
              {email.subject}
            </div>
            <div className="emailBody  text-justify">
              <div className="emailHeader">
                <div className="emailFrom flex flex-col text-left justify-start my-4">
                  <p className="fromName">
                    <span className=" font-medium">Sent From: </span>
                    {email.from}
                  </p>
                  <p className="fromName">
                    <span className=" font-medium">To: </span>
                    {email.to}
                  </p>
                  {/* <p className="fromEmail">fromEmail: {email.from}</p> */}
                </div>
              </div>
              <div className="emailContent bg-[#F1F1F1] rounded-xl p-6">
                {email.body.html && (
                  <div
                    className="emailBody"
                    dangerouslySetInnerHTML={{ __html: email.body.html }}
                  ></div>
                )}
                {!email.body.html && (
                  <div className="emailBody">{email.body.text}</div>
                )}
                {email.body.attachments && (
                  <div className="attachments border-t border-white">
                    <p className="font-bold py-2"> Attachments</p>
                    <div className="block md:flex gap-2 justify-between">
                      {email.body.attachments.pdf && (
                        <div className=" bg-[#74ecd5] p-[10px] rounded-2xl flex items-center">
                          <div
                            onClick={() =>
                              downloadFile(
                                email.body.attachments.pdf.filename,
                                email.body.attachments.pdf.data, // Assuming this is Base64 or binary data
                                "application/pdf"
                              )
                            }
                            className="p-4 rounded-full text-xl bg-white h-full flex items-center"
                          >
                            <GoDownload />
                          </div>
                          <div className="px-2 py-2">
                            {email.body.attachments.pdf.filename}
                          </div>
                        </div>
                      )}
                      {email.body.attachments.video.data && (
                        <div className=" bg-[#74ecd5] p-[10px] rounded-2xl flex items-center">
                          <div
                            onClick={() =>
                              downloadFile(
                                email.body.attachments.video.title,
                                email.body.attachments.video.data,
                                "video/mp4"
                              )
                            }
                            className="p-4 rounded-full text-xl bg-white h-full flex items-center"
                          >
                            <GoDownload />
                          </div>
                          <div className="px-2 py-2">
                            {email.body.attachments.video.title}
                          </div>
                        </div>
                      )}
                      {email.body.attachments.images.length > 0 &&
                        email.body.attachments.images.map((image) => (
                          <div className=" bg-[#74ecd5] p-[10px] rounded-2xl flex items-center">
                            <div
                              onClick={() =>
                                downloadFile(
                                  image.filename,
                                  image.data,
                                  "image/jpeg"
                                )
                              }
                              className="p-4 rounded-full text-xl bg-white h-full flex items-center"
                            >
                              <GoDownload />
                            </div>
                            <div className="px-2 py-2">{image.filename}</div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewEmail;
