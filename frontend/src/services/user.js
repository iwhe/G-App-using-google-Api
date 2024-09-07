import { http } from "./http";

export const registerUser = async (userdata) => {
  http.post("/auth/register", userdata);
};

export const getUser = async () => {
  http.get("/user/getCurrentUser");
};
// export const googleAuth = async () => {
//   http.post("/oauth/google");
// };
