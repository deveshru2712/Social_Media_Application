import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useUpdate = () => {
  const queryClient = useQueryClient();

  //if you want to wait for mutation then use MutateAsync

  const { mutateAsync: updateProfile, isPending: isUpdatingProfile } =
    useMutation({
      mutationFn: async (formData) => {
        try {
          const res = await fetch(`/api/users/update`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          });

          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.error || "Something went wrong");
          }

          return data;
        } catch (error) {
          throw new Error(error);
        }
      },
      onSuccess: () => {
        toast.success("Profile updated");
        Promise.all([
          queryClient.invalidateQueries({ queryKey: ["authUser"] }),
          queryClient.invalidateQueries({ queryKey: ["userProfile"] }),
        ]);
      },
      onError: () => {
        toast.error("Failed to update");
      },
    });
  return { updateProfile, isUpdatingProfile };
};

export default useUpdate;
