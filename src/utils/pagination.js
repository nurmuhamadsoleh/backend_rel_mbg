function getPagination(query) {
  const page = Math.max(Number(query.page || 1), 1);
  const limit = Math.min(Math.max(Number(query.limit || 10), 1), 100);
  const offset = (page - 1) * limit;

  return { page, limit, offset };
}

function getPagingData(count, page, limit) {
  return {
    page,
    limit,
    total_items: count,
    total_pages: Math.ceil(count / limit)
  };
}

module.exports = {
  getPagination,
  getPagingData
};
