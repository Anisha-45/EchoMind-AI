from database.connection import connection, cursor

# ==========================================
# Create Files Table
# ==========================================
cursor.execute("""
CREATE TABLE IF NOT EXISTS settings (

    id INTEGER PRIMARY KEY,

    scan_folder TEXT

)
""")


cursor.execute("""
CREATE TABLE IF NOT EXISTS files (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    name TEXT,

    path TEXT UNIQUE,

    extension TEXT,

    size INTEGER,

    created_at TEXT,

    modified_at TEXT,

    hash TEXT,

    indexed_at TEXT

)
""")

# ==========================================
# Create Files Table
# ==========================================
# ==========================================
# Create Document Content Table
# ==========================================

cursor.execute("""
CREATE TABLE IF NOT EXISTS document_content (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    file_id INTEGER UNIQUE,

    raw_text TEXT,

    pages INTEGER,

    title TEXT,

    FOREIGN KEY(file_id) REFERENCES files(id)

)
""")

# ==========================================
# Create Document Content Table
# ==========================================

cursor.execute("""
CREATE TABLE IF NOT EXISTS document_chunks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    file_id INTEGER NOT NULL,
    page_number INTEGER NOT NULL,
    chunk_index INTEGER NOT NULL,
    chunk_text TEXT NOT NULL,
    embedding TEXT,
    FOREIGN KEY(file_id) REFERENCES files(id)
)
""")

connection.commit()
# ==========================================
# Create Embeddings Table
# ==========================================

cursor.execute("""
CREATE TABLE IF NOT EXISTS embeddings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    file_id INTEGER,
    vector_path TEXT,
    FOREIGN KEY(file_id) REFERENCES files(id)
)
""")

# ==========================================
# Create Search History Table
# ==========================================

cursor.execute("""
CREATE TABLE IF NOT EXISTS search_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    query TEXT,
    timestamp TEXT
)
""")

# Save Changes
connection.commit()


print("All database tables created successfully!")