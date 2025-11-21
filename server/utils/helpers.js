import bcrypt from "bcrypt";

export const hashPassword = async (password) => {
  //   const salt = await bcrypt.genSalt();
  //   const hashedPassword = await bcrypt.hash(password, salt);
  const hashedPassword = await bcrypt.hash(password, 10); //does the same in one line.
  return hashedPassword;
};

export const comparePassword = async (plain, hashed) => {
  return await bcrypt.compare(plain, hashed);
};
