function buildFilters(query) {
  const { type, category, location, city, neighborhood, minPrice, maxPrice, min, max, bedrooms, status, q } = query;
  const filters = {};

  if (type) {
    filters.type = type;
  }
  if (category) {
    filters.category = category;
  }
  if (status) {
    filters.status = status;
  }
  if (city) {
    filters.city = new RegExp(city, 'i');
  }
  if (neighborhood) {
    filters.neighborhood = new RegExp(neighborhood, 'i');
  }
  if (location && !city && !neighborhood) {
    // Busca ampla quando apenas "location" for usado (bairros/cidades).
    const locationRegex = new RegExp(location, 'i');
    filters.$or = [
      { neighborhood: locationRegex },
      { city: locationRegex },
      { address: locationRegex },
    ];
  }
  if (minPrice || maxPrice) {
    filters.price = {};
    if (minPrice) filters.price.$gte = Number(minPrice);
    if (maxPrice) filters.price.$lte = Number(maxPrice);
  }
  if (min || max) {
    filters.price = filters.price || {};
    if (min) filters.price.$gte = Number(min);
    if (max) filters.price.$lte = Number(max);
  }
  if (bedrooms) {
    filters.bedrooms = { $gte: Number(bedrooms) };
  }
  if (q) {
    const regex = new RegExp(q, 'i');
    filters.$or = [{ title: regex }, { description: regex }, { neighborhood: regex }, { city: regex }];
  }

  return filters;
}

module.exports = { buildFilters };
