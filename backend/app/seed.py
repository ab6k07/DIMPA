from app.database import engine, SessionLocal, Base
from app.models.user import User, UserRole
from app.models.department import Department
from app.core.security import hash_password

def seed_database():
    print("Creating tables if they do not exist...")
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        # 1. Seed Departments
        departments_data = [
            ("Roads", "RDS", "Road maintenance, potholes, and street damage"),
            ("Solid Waste", "SWD", "Waste collection, garbage overflow, and public sanitation"),
            ("Electricity", "ELE", "Streetlights, wiring, and electrical infrastructure"),
            ("Water Supply", "WTR", "Pipeline leakage, water quality, and supply faults"),
            ("Storm Drains", "STM", "Drain blockage, urban flooding, and stormwater management"),
        ]

        print("Seeding departments...")
        for name, code, desc in departments_data:
            existing_dept = db.query(Department).filter(Department.name == name).first()
            if not existing_dept:
                dept = Department(name=name, code=code, description=desc)
                db.add(dept)
                print(f"  + Added Department: {name} ({code})")
            else:
                print(f"  = Department exists: {name}")

        # 2. Seed Demo Users
        users_data = [
            {
                "full_name": "Shreyas",
                "email": "citizen@civicresolve.in",
                "phone": "+91 98765 43210",
                "password": "Citizen@123",
                "role": UserRole.CITIZEN.value,
            },
            {
                "full_name": "Abhishek",
                "email": "authority@civicresolve.in",
                "phone": "+91 98765 43211",
                "password": "Authority@123",
                "role": UserRole.AUTHORITY.value,
            },
            {
                "full_name": "Kanishk",
                "email": "officer@civicresolve.in",
                "phone": "+91 98765 43212",
                "password": "Officer@123",
                "role": UserRole.FIELD_OFFICER.value,
            },
        ]

        print("Seeding demo users...")
        for u in users_data:
            existing_user = db.query(User).filter(User.email == u["email"]).first()
            if not existing_user:
                hashed_pw = hash_password(u["password"])
                user = User(
                    full_name=u["full_name"],
                    email=u["email"],
                    phone=u["phone"],
                    hashed_password=hashed_pw,
                    role=u["role"],
                    is_active=True,
                )
                db.add(user)
                print(f"  + Added User: {u['full_name']} <{u['email']}> [{u['role']}]")
            else:
                print(f"  = User exists: {u['email']}")

        db.commit()
        print("Database seeding completed successfully!")
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
