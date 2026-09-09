

from fastapi import APIRouter, HTTPException

from app.compiler.pipeline import compile_source
from app.models.compiler import CompilationResult, CompileRequest

router = APIRouter()


@router.post("/compile", response_model=CompilationResult)
def compile_endpoint(request: CompileRequest) -> CompilationResult:
    try:
        return compile_source(request.source)
    except ValueError as exc:
        # Genuine bad input (e.g. empty source) -- 400, per API-spec.md
        # Section 7 INVALID_REQUEST. Distinct from a normal phase-failure
        # result, which is still a 200.
        raise HTTPException(status_code=400, detail=str(exc)) from exc
