import { useRouter } from "next/router";

const Post = () => {
  const router = useRouter();
  console.log(router);
  const { link } = router.query;

  return <p>Link: {link}</p>;
};

export default Post;
