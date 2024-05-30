export const apiResponse = (message: string, statusCode: number, data: any) => {
  return {
    success: true,
    statusCode,
    data: data,
    message,
  };
};
