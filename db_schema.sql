
-- 1. جدول تسجيل الأحداث الخام (Raw Signals)
CREATE TABLE IF NOT EXISTS insight_raw_signals (
    time TIMESTAMPTZ NOT NULL,
    source TEXT,
    category TEXT, -- (OSINT, BGP, SAT, ECON)
    raw_data JSONB,
    sentiment_score FLOAT
);
SELECT create_hypertable('insight_raw_signals', 'time', if_not_exists => TRUE);

-- 2. جدول المؤشرات الاستباقية (Predictive Indicators)
CREATE TABLE IF NOT EXISTS insight_indicators (
    time TIMESTAMPTZ NOT NULL,
    indicator_type TEXT, -- (bgp_anomalies, shadow_depth, car_density, food_price_index)
    value FLOAT,
    location_id TEXT,
    confidence_interval FLOAT
);
SELECT create_hypertable('insight_indicators', 'time', if_not_exists => TRUE);

-- 3. جدول التنبؤات والإنذار المبكر (Predictions & Alerts)
CREATE TABLE IF NOT EXISTS insight_predictions (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    target_event TEXT,
    probability FLOAT,
    causal_factors JSONB, -- (List of indicators that triggered this)
    time_window_start TIMESTAMPTZ,
    time_window_end TIMESTAMPTZ,
    threat_level TEXT -- (Low, Elevated, Critical)
);

-- 4. إدراج بيانات تجريبية أولية (Initial Seeding)
INSERT INTO insight_indicators (time, indicator_type, value, location_id, confidence_interval)
VALUES 
(NOW() - INTERVAL '1 hour', 'bgp_anomalies', 14.5, 'Aden_Gateway', 0.92),
(NOW() - INTERVAL '30 minutes', 'car_density', 0.85, 'Sana_Central_Market', 0.78);

-- 5. جدول سجلات الحوكمة والمساءلة (Governance & Audit Logs)
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    prompt_text TEXT,              -- ماذا سأل المستخدم؟
    model_response TEXT,           -- بماذا أجاب النظام؟
    safety_flag BOOLEAN DEFAULT FALSE, -- هل تم تفعيل حواجز الحماية؟
    flag_category TEXT,            -- تصنيف الخطر (Hate Speech, Deepfake, Privacy)
    human_override_reason TEXT     -- إذا تدخل المشرف لتغيير القرار، لماذا؟
);
SELECT create_hypertable('audit_logs', 'timestamp', if_not_exists => TRUE);
