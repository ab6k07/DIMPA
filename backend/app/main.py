from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base
from app.routers.auth import router as auth_router
from app.routers.users import router as users_router
# Import models so Base.metadata knows about them
from app.models import User, Department

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure database tables exist
    Base.metadata.create_all(bind=engine)
    yield

app = FastAPI(
    title="CivicResolve Platform API",
    description="Distributed Municipal Incident Management Platform — Phase 1 Auth & RBAC",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers
app.include_router(auth_router, prefix="/api/v1")
app.include_router(users_router, prefix="/api/v1")

@app.get("/", tags=["Health"])
def root():
    return {
        "platform": "CivicResolve",
        "status": "online",
        "version": "1.0.0",
        "docs": "/docs",
    }

@app.get("/api/health", tags=["Health"])
def health():
    return {"status": "healthy"}
