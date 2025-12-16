import Feed from "@/components/Feed";
import { useUser } from "@/repositories/userRepository";

export default function Index() {
  const { data, error, isLoading } = useUser();

  return (
    <>
      <Feed />
    </>
  );
}
