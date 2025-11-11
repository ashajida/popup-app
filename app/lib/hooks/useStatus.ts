import type { Status } from "app/components/Status";
import { useCallback, useState } from "react";

type UseStatusProps = {
    defaultStatus: Status;
};

export const useStatus = ({ defaultStatus }: UseStatusProps) => {
      const [status, setStatus] = useState<Status>(defaultStatus);
      const handleStatusChange = useCallback(
        (newValue: "draft" | "active") => setStatus(newValue),
        [setStatus],
      );
      return {
        status,
        handleStatusChange
      }
}