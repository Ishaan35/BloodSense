import { useRouter } from "next/router";

const redirectToGoogleSSO = async () => {
  const googleLoginURL = `${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/login/google`;
  const newWindow = window.open(
    googleLoginURL,
    "_blank",
    "width=500, height=600"
  );

  newWindow.addEventListener("unload", () => {

  });
};

