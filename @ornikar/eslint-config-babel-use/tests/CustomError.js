// https://github.com/sindresorhus/eslint-plugin-unicorn/issues/753
export class CustomError extends Error {
  constructor(message) {
    super(message);

    this.name = 'CustomError'; // eslint-disable-line prefer-class-properties/prefer-class-properties
  }
}
