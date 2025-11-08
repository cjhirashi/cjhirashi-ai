import { toast as customToast } from "@/components/toast";

export interface ToastProps {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
}

export function useToast() {
  return {
    toast: (props: ToastProps) => {
      const { title, description, variant = "default" } = props;
      const message = title
        ? `${title}${description ? ": " + description : ""}`
        : description || "";

      if (variant === "destructive") {
        customToast({
          type: "error",
          description: message,
        });
      } else {
        customToast({
          type: "success",
          description: message,
        });
      }
    },
  };
}
