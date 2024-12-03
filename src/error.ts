class WebError extends Error {
  public status;
  public message;
  public details;

  constructor(status: number, message: string, details?: object) {
    super(message);

    this.status = status;
    this.message = message;
    this.details = details;

    console.trace(message);
  }
}

export { WebError };
