

export const fetchFileSystem = async (
  baseUrl: string,
): Promise<Record<string, any>> => {
  const result = await fetch(baseUrl);
  return await JSON.parse(await result.text());
};
