// Base validation rules
export const validateEmail = (email) => {
  if (!email) return "Email är obligatorisk";

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Ogiltig e-postadress";

  return null; // No error
};

export const validatePassword = (password, options = {}) => {
  const { minLength = 6, requireSpecialChar = false } = options;

  if (!password) return "Lösenord är obligatoriskt";

  if (password.length < minLength) {
    return `Lösenordet måste vara minst ${minLength} tecken`;
  }

  if (requireSpecialChar && !/[!@#$%^&*]/.test(password)) {
    return "Lösenordet måste innehålla ett specialtecken";
  }

  return null;
};

export const validateUsername = (username) => {
  if (!username) return "Användarnamn är obligatoriskt";

  if (username.length < 3) {
    return "Användarnamnet måste vara minst 3 tecken";
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return "Användarnamn får endast innehålla bokstäver, siffror och understreck";
  }

  return null;
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) return "Bekräfta lösenord är obligatoriskt";

  if (password !== confirmPassword) {
    return "Lösenorden matchar inte";
  }

  return null;
};

// Form-specific validators that compose the above
export const validateLoginForm = (formData) => {
  const errors = {};

  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(formData.password);
  if (passwordError) errors.password = passwordError;

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};

export const validateRegisterForm = (formData) => {
  const errors = {};

  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;

  const usernameError = validateUsername(formData.username);
  if (usernameError) errors.username = usernameError;

  // Different password requirements for registration
  const passwordError = validatePassword(formData.password, {
    minLength: 8,
    requireSpecialChar: true,
  });
  if (passwordError) errors.password = passwordError;

  const confirmError = validateConfirmPassword(
    formData.password,
    formData.confirmPassword
  );
  if (confirmError) errors.confirmPassword = confirmError;

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};
