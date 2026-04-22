// src/pages/News.jsx
import { useEffect, useState } from "react";
import axios from "axios";

const SPACE_NEWS_API = "https://api.spaceflightnewsapi.net/v4/articles/?limit=50";
const NASA_RSS = "https://api.rss2json.com/v1/api.json?rss_url=https://www.nasa.gov/rss/dyn/breaking_news.rss";
const ESA_RSS = "https://api.rss2json.com/v1/api.json?rss_url=https://www.esa.int/rssfeed/Our_Activities";

const News = () => {
  const [articles, setArticles] = useState([]);
  const [nasaNews, setNasaNews] = useState([]);
  const [esaNews, setEsaNews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 8;
  const [loading, setLoading] = useState(true);
  const [filteredArticles, setFilteredArticles] = useState([]);

  useEffect(() => {
    const fetchAllNews = async () => {
      try {
        const [spaceRes, nasaRes, esaRes] = await Promise.all([
          axios.get(SPACE_NEWS_API),
          axios.get(NASA_RSS),
          axios.get(ESA_RSS),
        ]);

        setArticles(spaceRes.data.results);
        setFilteredArticles(spaceRes.data.results);
        setNasaNews(nasaRes.data.items);
        setEsaNews(esaRes.data.items);
      } catch (err) {
        console.error("Error fetching news:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllNews();
  }, []);

  useEffect(() => {
    const filtered = articles.filter((article) =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredArticles(filtered);
    setCurrentPage(1);
  }, [searchTerm, articles]);

  const indexOfLast = currentPage * articlesPerPage;
  const indexOfFirst = indexOfLast - articlesPerPage;
  const currentArticles = filteredArticles.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);

  // Handle image loading errors
  const handleImageError = (e) => {
    e.target.src = "https://images.unsplash.com/photo-1543722530-d2c3201371e7?q=80&w=1174&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
  };

  return (
    <div className="news-container-news">
      <div className="news-header">
        <div className="header-content">
          <h1>🪐 Cosmic Chronicle</h1>
          <p>Latest discoveries, missions, and breakthroughs in space exploration</p>
        </div>
        <div className="search-section">
          <div className="search-container-news">
            <input
              type="text"
              placeholder="Search space news..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>
          <div className="source-badges">
            <div className="badge nasa">NASA</div>
            <div className="badge esa">ESA</div>
            <div className="badge space-api">Space API</div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-container-news">
          <div className="loading-spinner"></div>
          <p>Loading cosmic headlines...</p>
        </div>
      ) : (
        <>
          <div className="news-grid">
            {currentArticles.map((article) => (
              <div key={article.id} className="news-card">
                <div className="card-image">
                  <img
                    src={article.image_url || "https://images.unsplash.com/photo-1543722530-d2c3201371e7?q=80&w=1174&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
                    alt={article.title}
                    onError={handleImageError}
                  />
                </div>
                <div className="card-content">
                  <div className="card-header">
                    <span className="source-tag">Space News API</span>
                    <span className="date">{new Date(article.publishedAt).toLocaleDateString()}</span>
                  </div>
                  <h2>{article.title}</h2>
                  <p>{article.summary.substring(0, 150)}...</p>
                  <div className="card-footer">
                    <a href={article.url} target="_blank" rel="noopener noreferrer" className="read-more">
                      Explore Article
                      <span className="arrow">→</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pagination">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="prev-next"
            >
              ← Previous
            </button>
            
            <div className="page-numbers">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(pageNum)}
                    className={currentPage === pageNum ? "active" : ""}
                  >
                    {pageNum}
                  </button>
                );
              })}
              {totalPages > 5 && currentPage < totalPages - 2 && (
                <span className="ellipsis">...</span>
              )}
              {totalPages > 5 && currentPage < totalPages - 1 && (
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  className={currentPage === totalPages ? "active" : ""}
                >
                  {totalPages}
                </button>
              )}
            </div>
            
            <button 
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="prev-next"
            >
              Next →
            </button>
          </div>

          <div className="agency-feeds">
            <div className="rss-section nasa">
              <div className="section-header">
                <div className="agency-icon">🚀</div>
                <h2>NASA Breaking News</h2>
              </div>
              <div className="rss-list">
                {nasaNews.slice(0, 5).map((item, i) => (
                  <a 
                    key={i} 
                    href={item.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="rss-item"
                  >
                    <span className="rss-title">{item.title}</span>
                    <span className="rss-date">{new Date(item.pubDate).toLocaleDateString()}</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="rss-section esa">
              <div className="section-header">
                <div className="agency-icon">🛰</div>
                <h2>ESA Latest Updates</h2>
              </div>
              <div className="rss-list">
                {esaNews.slice(0, 5).map((item, i) => (
                  <a 
                    key={i} 
                    href={item.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="rss-item"
                  >
                    <span className="rss-title">{item.title}</span>
                    <span className="rss-date">{new Date(item.pubDate).toLocaleDateString()}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      <div className="space-background"></div>
    </div>
  );
};

export default News;