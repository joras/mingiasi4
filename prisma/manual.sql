-- GIN INDEXES
CREATE INDEX "Product_fulltext_tsvec" ON "Product" USING GIST (to_tsvector('english', size || ' ' || color || ' ' || name));