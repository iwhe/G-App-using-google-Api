import { http } from "./http";

export const getEmailById = async (id) => {
  return http.get(`/oauth/email/getEmailById/${id}`);
};

export const getInbox = async () => {
  return http.get("/oauth/gmail/inbox");
};

export const getSent = async () => {
  return http.get("/oauth/gmail/sentEmail");
};
