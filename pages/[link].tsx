import { useRouter } from "next/router";
import { useEffect } from "react";
import { getOneLink } from "../helper/getOneLink";
import Error from "next/error";

export const getServerSideProps = async (context) => {
  const { link } = context.params;
  return {
    props: {
      link: (await getOneLink(link))["data"] || null,
    },
  };
};

export default function Link({ link }) {
  const router = useRouter();
  useEffect(() => {
    if (link) {
      window.location.replace(link["real_link"]);
    }
  }, []);
  if (router.isFallback) {
    return <div>Loading....</div>;
  }
  if (!link) {
    return <Error statusCode={404} />;
  }
  return <a href={link["real_link"]}>Redirecting to {link["real_link"]}</a>;
}
