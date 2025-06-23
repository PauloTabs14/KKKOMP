import database as db

def check_users():
    conn = db.connect()
    cursor = conn.cursor()
    
    # Check if admin user exists and its type
    cursor.execute("SELECT username, user_type FROM users WHERE username = 'admin'")
    admin = cursor.fetchone()
    if admin:
        print(f"Admin user found. Type: {admin['user_type'] if admin else 'N/A'}")
    else:
        print("Admin user not found!")
    
    # List all users
    print("\nAll users in the database:")
    cursor.execute("SELECT username, user_type FROM users")
    for user in cursor.fetchall():
        print(f"Username: {user['username']}, Type: {user['user_type']}")
    
    conn.close()

if __name__ == "__main__":
    check_users()
