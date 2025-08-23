-- Create link_clicks table
CREATE TABLE IF NOT EXISTS link_clicks (
    id VARCHAR(36) PRIMARY KEY,
    link_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    referrer TEXT,
    country VARCHAR(2),
    clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (link_id) REFERENCES links(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_link_clicks_user_id (user_id),
    INDEX idx_link_clicks_clicked_at (clicked_at)
);

-- Create profile_views table
CREATE TABLE IF NOT EXISTS profile_views (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    referrer TEXT,
    country VARCHAR(2),
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_profile_views_user_id (user_id),
    INDEX idx_profile_views_viewed_at (viewed_at)
);
