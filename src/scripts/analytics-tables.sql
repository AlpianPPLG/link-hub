-- Create analytics tables for detailed tracking

-- Link clicks with detailed information
CREATE TABLE IF NOT EXISTS link_clicks (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    link_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    referrer VARCHAR(500),
    country VARCHAR(2),
    city VARCHAR(100),
    clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (link_id) REFERENCES links(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_link_clicks_link_id (link_id),
    INDEX idx_link_clicks_user_id (user_id),
    INDEX idx_link_clicks_date (clicked_at)
);

-- Profile views tracking
CREATE TABLE IF NOT EXISTS profile_views (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    referrer VARCHAR(500),
    country VARCHAR(2),
    city VARCHAR(100),
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_profile_views_user_id (user_id),
    INDEX idx_profile_views_date (viewed_at)
);

-- Daily analytics summary for better performance
CREATE TABLE IF NOT EXISTS daily_analytics (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    date DATE NOT NULL,
    profile_views INT DEFAULT 0,
    total_clicks INT DEFAULT 0,
    unique_visitors INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_date (user_id, date),
    INDEX idx_daily_analytics_user_date (user_id, date)
);
