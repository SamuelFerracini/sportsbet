export function slugify(str) {
  return str
    .toLowerCase() // Convert to lowercase
    .replace(/\s+/g, "-") // Replace spaces with dashes
    .replace(/[^\w-]/g, ""); // Remove non-word characters (excluding dashes)
}
