export const REGEX = {
  EMAIL: /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/,
  PASSWORD: /^(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/,
  SPECIAL_CHAR_ONLY: /[!@#$%^&*]/,
  AT_LEAST_ONE_CAP_LETTER: /[A-Z]/,
  AT_LEAST_ONE_NUMBER: /[0-9]/,
  PHONE: /^\d{8,12}$/,
  USERNAME: /^[a-z0-9._]{3,30}$/,
  DOB: /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/,
};
