export const hoursAgo = (h) => new Date(Date.now() - h * 3600 * 1000).toISOString();
export const daysFromNow = (d) => new Date(Date.now() + d * 86400 * 1000).toISOString();
