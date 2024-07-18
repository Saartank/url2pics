import Head from "next/head";

const CustomHead = ({ title = "Url2Pics" }) => (
  <Head>
    <title>{title}</title>
    <meta name="description" content="Landing page for Url2Pics" />
    <link rel="icon" href="/camera.ico" />
  </Head>
);

export default CustomHead;
