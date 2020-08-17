import { useRouter } from "next/router";
import { useEffect } from "react";
import { getAllLink } from "../helper/getAllLink";
import { getOneLink } from "../helper/getOneLink";
import mitt from "next/dist/next-server/lib/mitt";

export async function getStaticPaths() {
  const links = await getAllLink();
  let paths = [];
  if (links) {
    paths = links.data.map((token) => ({
      params: { link: token.generated_link },
    }));
  }

  // fallback: false means pages that don’t have the
  // correct id will 404.
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  return {
    props: {
      link: (await getOneLink(params.link))["data"],
    },
  };
}

export default function Link({ link }) {
  const router = useRouter();
  useEffect(() => {
    router.push(link["real_link"]);
  }, []);
  return <a href={link["real_link"]}>Redirecting to {link["real_link"]}</a>;
}
