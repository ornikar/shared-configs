// https://github.com/sindresorhus/eslint-plugin-unicorn/issues/753
export class CustomError extends Error {
  constructor(message) {
    super(message);

    // eslint-disable-next-line prefer-class-properties/prefer-class-properties
    this.name = 'CustomError';
  }
}
