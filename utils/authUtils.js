import axios from "axios";

export async function checkAuthenticationWithCookie(cookie) {
  try {
    const response = await axios({
      headers: {
        Cookie: cookie,
      },
      method: "get",
      withCredentials: true,
      url: `${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/getUser`,
    });
    const user = response.data;
    return user ? user : null;
  } catch (err) {
    console.log(err);
    return false;
  }
}

export async function fetchUser(){
  const user = await axios({
    method: "get",
    url: `${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/getUser`,
    withCredentials: true,
  });

  return user;
}
