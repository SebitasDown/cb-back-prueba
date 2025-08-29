import { getSearchAllVideos, getSearchVideos } from "./search.model.js";

export const searchVideos = async (req, res) => {
  const q = (req.query.q || "").trim();

  if (!q) {
    const allVideos = await getSearchAllVideos();
    return res.json(allVideos);
  }

  const rows = await getSearchVideos(q);
  res.json(rows);
};
