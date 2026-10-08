-- Power Consumption Forecasting and Analytics System
-- Table for storing power consumption historical records

CREATE DATABASE IF NOT EXISTS power_analytics_db;
USE power_analytics_db;

CREATE TABLE IF NOT EXISTS power_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    record_date DATE NOT NULL,
    record_time VARCHAR(8) NOT NULL,
    hour INT NOT NULL,
    temperature DECIMAL(5, 2) NOT NULL,
    previous_consumption DECIMAL(8, 2) NOT NULL,
    consumption DECIMAL(8, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample starter insert for verification
INSERT INTO power_records (record_date, record_time, hour, temperature, previous_consumption, consumption)
VALUES 
    ('2026-01-01', '00:00:00', 0, 18.5, 210.4, 205.2),
    ('2026-01-01', '01:00:00', 1, 17.8, 205.2, 198.6),
    ('2026-01-01', '02:00:00', 2, 17.2, 198.6, 190.1),
    ('2026-01-01', '03:00:00', 3, 16.9, 190.1, 185.7),
    ('2026-01-01', '04:00:00', 4, 16.5, 185.7, 188.3);
