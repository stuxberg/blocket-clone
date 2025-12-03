export const createUserValidationSchema = {
  email: {
    isEmail: {
      errorMessage: "Must be an email",
    },

    notEmpty: {
      errorMessage: "Email cannot be empty",
    },
  },

  username: {
    isLength: {
      options: {
        min: 5,
        max: 32,
      },

      errorMessage:
        "Username must be at least 5 characters with a max of 32 characters",
    },
    notEmpty: {
      errorMessage: "Username cannot be empty",
    },
    isString: {
      errorMessage: "Username must be a string!",
    },
  },

  password: {
    notEmpty: true,
  },
};

export const loginUserValidationSchema = {
  email: {
    isEmail: {
      errorMessage: "Must be an email",
    },

    notEmpty: {
      errorMessage: "Email cannot be empty",
    },
  },
  password: {
    notEmpty: {
      errorMessage: "Password is required",
    },
  },
};
