export function getImageUrl(item) {
  if (item.imageurl) return item.imageurl;
  if (item.image && typeof item.image === 'string') return item.image;
  if (item.image && Array.isArray(item.image) && item.image[0]?.url) return item.image[0].url;
  return 'https://via.placeholder.com/300x450?text=No+Image';
}
