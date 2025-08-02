export const extractKeysFromURL = (url: string): string[] => {
  const regex = /<([^>]+)>/g;
  const matches = [];
  let match;
  while ((match = regex.exec(url)) !== null) {
    matches.push(match[1]);
  }
  return matches;
};

export const convertUrlParamsToValues = (
  url: string,
  data: Record<string, any>
): string => {
  return extractKeysFromURL(url).reduce((processedUrl, key) => {
    if (data[key] !== undefined) {
      return processedUrl.replaceAll(`<${key}>`, data[key]);
    }
    console.warn(`Missing value for URL parameter: ${key}`);
    return processedUrl;
  }, url);
};
