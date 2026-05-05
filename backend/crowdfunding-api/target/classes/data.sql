INSERT INTO user_types (type_name) VALUES ('INVESTOR'), ('STARTUP');

INSERT INTO categories (category_name, description)
VALUES ('Technology', 'Tech startups and apps'),
       ('Health', 'Healthcare and wellness'),
       ('Education', 'EdTech solutions');

-- Subscription Plans for INVESTOR (user_type_id = 1)
INSERT INTO subscription_plans (duration_months, priceinr, priceusd, priceeur, user_type_id, created_at)
VALUES (3, 299, 3.59, 3.39, 1, NOW()),
       (6, 499, 5.99, 5.65, 1, NOW()),
       (12, 999, 11.99, 11.34, 1, NOW());

-- Subscription Plans for STARTUP (user_type_id = 2)
INSERT INTO subscription_plans (duration_months, priceinr, priceusd, priceeur, user_type_id, created_at)
VALUES (3, 299, 3.59, 3.39, 2, NOW()),
       (6, 499, 5.99, 5.65, 2, NOW()),
       (12, 999, 11.99, 11.34, 2, NOW());

-- Sample User
INSERT INTO users (name, email, password, user_type_id, created_at)
VALUES ('John Investor', 'investor@example.com', 'hashed_password', 1, NOW());
