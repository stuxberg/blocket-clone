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

export const createListingValidationSchema = {
  category: {
    notEmpty: {
      errorMessage: "Category cannot be empty",
    },
    isString: {
      errorMessage: "Category must be a string",
    },
  },

  title: {
    notEmpty: {
      errorMessage: "Title cannot be empty",
    },
    isLength: {
      options: {
        min: 3,
        max: 100,
      },
      errorMessage: "Title must be between 3 and 100 characters",
    },
    isString: {
      errorMessage: "Title must be a string",
    },
  },

  description: {
    notEmpty: {
      errorMessage: "Description cannot be empty",
    },
    isLength: {
      options: {
        min: 10,
        max: 5000,
      },
      errorMessage: "Description must be between 10 and 5000 characters",
    },
    isString: {
      errorMessage: "Description must be a string",
    },
  },

  price: {
    notEmpty: {
      errorMessage: "Price cannot be empty",
    },
    isNumeric: {
      errorMessage: "Price must be a number",
    },
    custom: {
      options: (value) => value > 0,
      errorMessage: "Price must be greater than 0",
    },
  },

  postalCode: {
    notEmpty: {
      errorMessage: "Postal code cannot be empty",
    },
    isLength: {
      options: {
        min: 5,
        max: 5,
      },
      errorMessage: "Postal code must be exactly 5 digits",
    },
    isNumeric: {
      errorMessage: "Postal code must contain only numbers",
    },
  },
};
