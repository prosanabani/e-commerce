export class NextRequest extends Request {
  constructor(input: RequestInfo | URL, init?: RequestInit) {
    super(input, init);
  }

  get nextUrl() {
    return new URL(this.url);
  }
}

export class NextResponse extends Response {
  static json(body: unknown, init?: ResponseInit) {
    return Response.json(body, init);
  }
}
