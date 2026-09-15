"""/history endpoint -- API-spec.md Section 5. In-memory stub for
Sprint 9; real persistence arrives with the database in v3 (Phases.md)."""

from fastapi import APIRouter

from app.models.compiler import (
    CompilationRecord,
    CompilerPhase,
    CompileStatus,
    HistoryResponse,
)

router = APIRouter()

_STUB_HISTORY: list[CompilationRecord] = [
    CompilationRecord(
        id="comp_9182",
        projectId="proj_42",
        timestamp="2026-07-20T10:15:00Z",
        status=CompileStatus.SUCCESS,
        failedAtPhase=None,
    ),
    CompilationRecord(
        id="comp_9181",
        projectId="proj_42",
        timestamp="2026-07-20T09:58:00Z",
        status=CompileStatus.FAILED,
        failedAtPhase=CompilerPhase.SYNTAX,
    ),
]


@router.get("/history/{project_id}", response_model=HistoryResponse)
def get_history(project_id: str, limit: int = 20, offset: int = 0) -> HistoryResponse:
    items = [r for r in _STUB_HISTORY if r.projectId == project_id]
    page = items[offset : offset + limit]
    return HistoryResponse(total=len(items), items=page)
