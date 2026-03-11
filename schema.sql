DROP TABLE IF EXISTS items;

CREATE TABLE items (
  id INTEGER PRIMARY KEY, 
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price INTEGER NOT NULL, 
  image_url TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO items (name, description, price, image_url) VALUES
('Item 1', 'Description for Item 1', 20000, '/images/item1.png'),
('Item 2', 'Description for Item 2', 450000, '/images/item2.png'),
('Item 3', 'Description for Item 3', 1250000, '/images/item3.png');