export function getAssetURL(id) {
  if (!id) return null;
  return `https://testtrueeye.southeastasia.cloudapp.azure.com/directus/assets/${id}`;
}
