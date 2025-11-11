import { Grid, Card, Box, Thumbnail, VideoThumbnail, Text } from '@shopify/polaris';
import type { MediaCollectionResponse } from 'app/lib/services/media';
import Status from './Status';
import type { StatusProps } from './Status';
import type { FileResourceProps } from './FileResource';
import MediaModal from './MediaModal';
import { Modal, TitleBar } from '@shopify/app-bridge-react';

type Props = {
    media: MediaCollectionResponse["data"];
    setMedia: (media: MediaCollectionResponse["data"]) => void;
    selectedMedia: MediaCollectionResponse["data"][0] | undefined;
    setSelectedMedia: FileResourceProps["setSelectedMedia"];
    actionData?: any;
    status: StatusProps["status"];
    setStatus: StatusProps["setStatus"];
}

const Media = ({actionData, media, setSelectedMedia, setMedia, selectedMedia, status, setStatus }: Props) => {
  return (
                    <Grid>
                  <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 3, lg: 8, xl: 8 }}>
                    <Card>
                      <Text tone="critical" as="span">
                        {actionData?.success == false &&
                          actionData?.errors?.mediaUrl}
                      </Text>
                      <Box
                        style={{
                          display: "flex",
                          justifyContent: "end",
                        }}
                      >
                        <MediaModal
                          media={media as MediaCollectionResponse["data"] ||[]}
                          setSelectedMedia={setSelectedMedia}
                          setMedia={setMedia}
                        />
                      </Box>
                      <div>
                        {selectedMedia &&
                        selectedMedia.file.__typename == "MediaImage" ? (
                          <Thumbnail
                            key={selectedMedia.file.id}
                            source={selectedMedia.file?.image?.url || ""}
                            alt="Selected image"
                            size="large"
                          />
                        ) : selectedMedia &&
                          selectedMedia.file.__typename == "Video" && (
                          <Box>
                            <Box width='200px' borderRadius='full'>
                               <VideoThumbnail
                              key={selectedMedia.file.id}
                              onClick={() => {
                                shopify.modal.show("select-video-dialog");
                                }}
                                videoLength={0}
                                thumbnailUrl={
                                    selectedMedia.file.preview?.image?.url || ""
                                }
                                /> 
                            </Box>
                            <Modal id="select-video-dialog">
                             
                              <Box>
                                <video
                                  controls
                                  src={selectedMedia.file.sources[0].url}
                                  style={{ width: "100%" }}
                                  autoPlay
                                ></video>
                              </Box>
                            </Modal>
                          </Box>
                        )}
                      </div>
                    </Card>
                  </Grid.Cell>
                  <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 3, lg: 4, xl: 4 }}>
                    <Status status={status} setStatus={setStatus} />
                  </Grid.Cell>
                </Grid>
  )
}

export default Media