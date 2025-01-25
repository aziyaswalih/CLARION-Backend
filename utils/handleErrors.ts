export const handleErrors = (error: any): string => {
  if (error.code === 11000) {
    return "Duplicate field value entered";
  }
  return error.message || "An unknown error occurred";
};
