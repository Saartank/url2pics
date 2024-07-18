import { useState } from "react";
import { FaCamera } from "react-icons/fa";
import RandomImages from "../components/RandomImages";
import SignUp from "@/components/SignUp";
import Login from "@/components/Login";
import MainContainer from "@/components/MainContainer";
import CustomHead from "@/components/CustomHead";
import SuccessToast from "@/components/SuccessToast";
import { currentUserApi } from "@/utils/authentication-apis";
import cookie from "cookie";
export default function Home() {
  const [signUpFlag, setSignUpFlag] = useState(true);
  const [showToast, setShowToast] = useState(false);

  return (
    <>
      <CustomHead />
      <MainContainer>
        <RandomImages />
        {showToast && (
          <SuccessToast
            message="Sign up successful please login!"
            onClose={setShowToast}
          />
        )}

        <main className="bg-white rounded-lg shadow-lg p-10 w-1/2 mx-auto text-center relative z-10">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            <span className="text-gray-700">Welcome to </span>
            <span className="text-transparent text-6xl bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
              Url2Pics
            </span>
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Extract images from any webpage by simply providing its URL{" "}
            <FaCamera className="inline-block mr-2 mb-1" />
          </p>

          {signUpFlag ? (
            <SignUp
              onSubmit={() => {
                setSignUpFlag(false);
                setShowToast(true);
              }}
            />
          ) : (
            <Login />
          )}

          {signUpFlag && (
            <p className="text-gray-600">
              Already have an account?{" "}
              <button
                className="text-blue-600 hover:underline"
                onClick={() => setSignUpFlag(false)}
              >
                Log in here
              </button>
            </p>
          )}
          {!signUpFlag && (
            <p className="text-gray-600">
              Don't have an account?{" "}
              <button
                className="text-blue-600 hover:underline"
                onClick={() => setSignUpFlag(true)}
              >
                Sign up here
              </button>
            </p>
          )}
        </main>
      </MainContainer>
    </>
  );
}

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
      redirect: {
        destination: "/home",
        permanent: false,
      },
    };
  } catch (error) {
    return { props: {} };
  }
};
