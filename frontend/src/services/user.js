import { http } from "./http";

export const registerUser = async (userdata) => {
  return http.post("/auth/register", userdata);
};

export const getUser = async () => {
  return http.get("/user/getCurrentUser");
};

export const signOut = async () => {
  return http.post("/auth/logout");
};
// export const googleAuth = async () => {
//   http.post("/oauth/google");
// };
