export type ImageResponseOptions = {
  width?: number;
  height?: number;
};

export class ImageResponse extends Response {
  constructor(_element: unknown, _options?: ImageResponseOptions) {
    super(null, { status: 501 });
  }
}
