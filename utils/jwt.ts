import jwt from "jsonwebtoken";

export const signToken = (_id: string, email: string) => {
  const seed = process.env.JWT_SECRET_SEED;
  if (!seed) {
    throw new Error("there's not JWT seed - Check environment variables");
  }

  const payload = { _id, email };
  const options = { expiresIn: "30d" };

  return jwt.sign(payload, seed, options);
};

export const isValidToken = async (token: string): Promise<string> => {
  const seed = process.env.JWT_SECRET_SEED;
  if (!seed) {
    throw new Error("there's not JWT seed - Check environment variables");
  }

  if (token.length <= 10) {
    return Promise.reject("JWT is not valid");
  }

  return new Promise((resolve, reject) => {
    try {
      jwt.verify(token, seed, (err, payload) => {
        if (err) return reject("JWT is not valid");
        const { _id } = payload as { _id: string };

        resolve(_id);
      });
    } catch (error) {
      return reject("JWT is not valid");
    }
  });
};
