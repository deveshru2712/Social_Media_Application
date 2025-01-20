import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useFollow = () => {
  const queryClient = useQueryClient();

  const { mutate: follow, isPending } = useMutation({
    mutationFn: async () => {
      try {
        console.log("clicked");
        const res = await fetch(`/api/users/follow/:${userId}`, {
          method: "POST",
        });

        const data = await res.json();

        console.log(data);

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["suggestedUsers"] }),
        queryClient.invalidateQueries({ queryKey: ["authUser"] }),
      ]);
    },
    onError: () => {
      toast.error(error.message);
    },
  });
  return { follow, isPending };
};

export default useFollow;
