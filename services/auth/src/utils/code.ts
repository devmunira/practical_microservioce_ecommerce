export const generateVerificationCode = () => {
  const timeStamp = new Date().getTime().toString();

  const randomNumber = Math.floor(10 + Math.random() * 90);

  return (timeStamp + randomNumber).slice(-5);
};
