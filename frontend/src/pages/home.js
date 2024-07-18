import Navbar from "@/components/Navbar";
import { useState } from "react";
import SearcNewUrl from "@/components/SearchNewUrl";
import BrowseHistory from "@/components/BrowseHistory";
import CustomHead from "@/components/CustomHead";
import { currentUserApi } from "@/utils/authentication-apis";
import cookie from "cookie";
const page = ({ username, token }) => {
  const [activeTab, setActiveTab] = useState("Search New URL");
  return (
    <>
      <CustomHead title={"Url2Pics Home"} />
      <Navbar
        username={username}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-500 flex flex-col justify-start px-5 pt-5">
        {activeTab == "Search New URL" && <SearcNewUrl token={token} />}

        {activeTab == "Browse History" && (
          <BrowseHistory history={null} token={token} />
        )}
      </div>
    </>
  );
};

export default page;

export const getServerSideProps = async (context) => {
  try {
    const cookies = context.req.headers.cookie
      ? cookie.parse(context.req.headers.cookie)
      : {};

    const initialAccessToken = cookies.client_auth_token || null;

    if (!initialAccessToken) {
      throw new Error("No access token found");
    }

    const user = await currentUserApi(initialAccessToken);

    return {
      props: {
        username: user.name,
        token: initialAccessToken,
      },
    };
  } catch (error) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
};
