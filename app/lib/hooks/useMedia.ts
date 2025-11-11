import { useCallback, useState } from "react";
import type { MediaCollectionResponse } from "../services/media";

type UseMediaProps = {
    defaultMedia?: MediaCollectionResponse["data"];
    defaultSelectedMedia?: MediaCollectionResponse["data"][0];
};
export const useMedia = ({defaultMedia, defaultSelectedMedia}: UseMediaProps) => {
    const [selectedMedia, setSelectedMedia] = useState<MediaCollectionResponse["data"][0] | undefined>(defaultSelectedMedia && defaultSelectedMedia);

const [media, setMedia] = useState<UseMediaProps["defaultMedia"]>(
     defaultMedia || []
  );


const handleMediaChange = useCallback(
    (media: MediaCollectionResponse["data"]) => {
      setMedia(media);
    },
    [setMedia],
);


    const handleSelectedMediaChange = useCallback(
    (media: MediaCollectionResponse["data"][0] | undefined) => {
        if (!media) return;
        setSelectedMedia(media);
    },
    [setSelectedMedia],
    );

    return {
        selectedMedia,
        setSelectedMedia,
        handleSelectedMediaChange,
        media,
        handleMediaChange
    }
}