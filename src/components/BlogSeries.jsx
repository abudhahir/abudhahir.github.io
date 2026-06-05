import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';

export default function BlogSeries({ seriesInfo = [] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const filteredSeries = useMemo(() => {
    return seriesInfo.filter(s => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = s.name.toLowerCase().includes(searchLower) || 
                            (s.latestPost?.data?.excerpt || '').toLowerCase().includes(searchLower) ||
                            (s.latestPost?.data?.title || '').toLowerCase().includes(searchLower);
      return matchesSearch;
    });
  }, [seriesInfo, searchQuery]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  const formatDate = (dateObj) => {
    if (!dateObj) return '';
    try {
      const d = new Date(dateObj);
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return '';
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center mb-10">
        <p className="text-muted text-sm md:text-base max-w-2xl flex-1">
          Explore {seriesInfo.length} blog series. These grouped articles cover deep dives into specific topics.
        </p>

        {/* Search Box & View Toggle */}
        <div className="flex flex-row items-center gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-56 lg:w-64">
            <input 
              type="text" 
              placeholder="Search series..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full bg-secondary/30 border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-sm text-foreground transition-all duration-300"
            />
            <svg className="w-4 h-4 absolute left-4 top-1/2 transform -translate-y-1/2 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          {/* View Toggles */}
          <div className="flex items-center gap-1 bg-secondary/30 p-1 rounded-full border border-border/50 hidden md:flex shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-full transition-colors ${viewMode === 'grid' ? 'bg-primary text-black shadow-sm' : 'text-muted hover:text-foreground hover:bg-secondary/50'}`}
              aria-label="Grid View"
              title="Grid View"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-full transition-colors ${viewMode === 'list' ? 'bg-primary text-black shadow-sm' : 'text-muted hover:text-foreground hover:bg-secondary/50'}`}
              aria-label="List View"
              title="List View"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {filteredSeries.length === 0 ? (
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="text-center py-20 text-muted"
           >
             No series found matching your criteria.
           </motion.div>
        ) : (
          <motion.div
            key={searchQuery + viewMode}
            className={viewMode === 'grid' ? "grid md:grid-cols-2 lg:grid-cols-3 gap-5" : "flex flex-col gap-3"}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
          >
            {filteredSeries.map((series) => (
              <motion.div
                key={series.name}
                variants={itemVariants}
                className="group relative h-full"
              >
                <a
                  href={`/blog/series/${encodeURIComponent(series.name)}`}
                  className={`block glass rounded-xl md:rounded-2xl overflow-hidden border border-border/50 
                          hover:border-primary/70 transition-all duration-300 relative z-10 
                          group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] 
                          group-hover:-translate-y-0.5 bg-gradient-to-br from-background to-secondary/20
                          ${viewMode === 'grid' ? 'h-full flex flex-col' : 'w-full'}
                          `}
                >
                  <div className={`flex relative p-4 md:p-5 ${viewMode === 'grid' ? 'flex-col h-full flex-1' : 'flex-col md:flex-row gap-3 md:gap-6 items-start md:items-center w-full'}`}>
                    
                    {/* Glow effect on hover */}
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl md:rounded-2xl pointer-events-none"></div>

                    <div className={viewMode === 'list' ? 'flex-1 min-w-0 flex flex-col justify-center' : 'w-full flex-1 flex flex-col'}>
                      
                      <div className={`flex items-start justify-between gap-3 relative z-10 ${viewMode === 'grid' ? 'mb-2' : 'mb-1'}`}>
                        <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors leading-tight truncate">
                          {series.name}
                        </h3>
                        {series.count > 0 && viewMode === 'grid' && (
                          <div className="flex items-center gap-1 text-primary bg-primary/10 px-1.5 py-0.5 rounded text-[10px] font-medium border border-primary/20 whitespace-nowrap">
                            {series.count} posts
                          </div>
                        )}
                      </div>
                      
                      <p className={`text-muted text-sm relative z-10 leading-relaxed ${viewMode === 'grid' ? 'line-clamp-2 mb-4 flex-1' : 'line-clamp-1'}`}>
                        {series.latestPost?.data?.excerpt || `A series of ${series.count} posts about ${series.name}.`}
                      </p>

                    </div>
                    
                    <div className={`relative z-10 ${viewMode === 'list' ? 'flex flex-row items-center gap-4 w-full md:w-auto shrink-0 md:justify-end' : 'mt-4 pt-3 border-t border-border/50 w-full'}`}>
                      
                      {/* List-only metadata */}
                      {viewMode === 'list' && (
                        <div className="hidden md:flex items-center gap-4 w-32 shrink-0 justify-end">
                          <div className="flex items-center gap-1 text-primary text-xs font-medium">
                            {series.count} posts
                          </div>
                        </div>
                      )}

                      {viewMode === 'grid' && (
                        <div className="flex items-center justify-between">
                           <span className="text-[10px] text-muted font-mono uppercase tracking-wider">
                             Updated: {formatDate(series.latestPost?.data?.date)}
                           </span>
                           <span className="text-primary text-xs font-medium group-hover:translate-x-1 transition-transform duration-300 flex items-center gap-1">
                             View Series <span className="text-sm leading-none">&rarr;</span>
                           </span>
                        </div>
                      )}
                      
                      {viewMode === 'list' && (
                        <span className="hidden md:flex text-primary text-lg font-medium group-hover:translate-x-1 transition-transform duration-300 items-center ml-2">
                          &rarr;
                        </span>
                      )}
                    </div>
                  </div>
                </a>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
