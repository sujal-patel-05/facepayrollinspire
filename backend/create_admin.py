from database import SessionLocal
from models import Admin
from passlib.context import CryptContext

db = SessionLocal()
pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')

# Check if admin already exists
existing_admin = db.query(Admin).filter(Admin.username == 'admin').first()

if existing_admin:
    print("✅ Admin account already exists")
    print(f"   Username: admin")
    print(f"   Email: {existing_admin.email}")
else:
    admin = Admin(
        username='admin',
        email='admin@hrms.com',
        hashed_password=pwd_context.hash('admin123'),
        full_name='System Administrator'
    )
    db.add(admin)
    db.commit()
    print("✅ Admin account created successfully!")
    print(f"   Username: admin")
    print(f"   Password: admin123")
    print(f"   Email: admin@hrms.com")

db.close()
