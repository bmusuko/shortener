interface ShortenerForm {
  URL: String;
  custom?: String;
  password?: String;
}
interface PasswordForm {
  password: String;
  token: String;
}
export { ShortenerForm, PasswordForm };
