from database.connection import connection, cursor


def insert_file(file_data):

    cursor.execute("""
        INSERT OR IGNORE INTO files
        (
            name,
            path,
            extension,
            size,
            created_at,
            modified_at,
            hash,
            indexed_at
        )
        VALUES
        (?, ?, ?, ?, ?, ?, ?, ?)
    """,
    (
        file_data["name"],
        file_data["path"],
        file_data["extension"],
        file_data["size"],
        str(file_data["created_at"]),
        str(file_data["modified_at"]),
        None,
        None
    ))

    connection.commit()