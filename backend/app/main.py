"""
SmartCC backend -- FastAPI app entry point.

Sprint 9 scaffold: routes exist and match API-spec.md exactly, but the
compiler pipeline behind /compile is still a stub (app/compiler/pipeline.py).
Real compiler phases replace the stub incrementally across Sprints 10-14.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import CORS_ORIGINS
from app.routers import compile as compile_router
from app.routers import grammar as grammar_router
from app.routers import history as history_router

app = FastAPI(
    title="SmartCC API",
    description="Backend for the SmartCC Intelligent Compiler Visualizer.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(compile_router.router, prefix="/api/v1", tags=["compile"])
app.include_router(grammar_router.router, prefix="/api/v1", tags=["grammar"])
app.include_router(history_router.router, prefix="/api/v1", tags=["history"])


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}
