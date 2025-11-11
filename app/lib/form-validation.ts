import z from "zod";

export const schema = z.object({
  products: z.string('Products are required'),
  title: z.string().optional(),
  description: z.string().optional(),
  action: z.string('Action is required'),
  mediaCursor: z.string(),
  mediaId: z.string('Media ID is required'),
  name: z.string('Name is required').min(2, 'Name is required'),
  status: z.string('Status is required'),
  style: z.string().optional(),
  mediaType: z.string('Media Type is required'),
  mediaUrl: z.string('Media is required'),
});

export type Schema = z.infer<typeof schema>;