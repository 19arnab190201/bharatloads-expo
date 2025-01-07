export const getTimeLeft = (timeToExpiry) => {
  console.log("timeToExpiry", timeToExpiry);
  const now = new Date();
  const expiry = new Date(timeToExpiry);
  const diff = expiry - now;
  const hours = Math.floor(diff / 1000 / 60 / 60);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  return `${hours}h ${minutes}m`;
};
