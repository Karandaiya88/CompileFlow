"""
Integration tests for Sprint 9's endpoint scaffold -- Testing.md Section 3.

These test the request/response *contract* (matches API-spec.md), not
compiler correctness -- there's no real compiler yet. Per-algorithm
correctness tests (Testing.md Section 2.2) start in Sprint 10 once the
real lexer exists.
"""

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_compile_success_fixture():
    response = client.post("/api/v1/compile", json={"source": "int main() { return 0; }"})
    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "success"
    assert len(body["tokens"]) > 0
    assert body["ast"] is not None
    assert body["diagnostics"] == []


def test_compile_semantic_failure_fixture():
    response = client.post(
        "/api/v1/compile",
        json={"source": "int main() { return undeclared_demo + 1; }"},
    )
    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "failed"
    assert body["failedAtPhase"] == "semantic"
    assert len(body["diagnostics"]) == 1
    assert body["diagnostics"][0]["phase"] == "semantic"


def test_compile_real_syntax_error():
    """Sprint 11: a genuinely invalid program (missing semicolon) now
    fails at the syntax phase with a real diagnostic, not a canned one."""
    response = client.post(
        "/api/v1/compile",
        json={"source": "int main() { int x = 5 return x; }"},
    )
    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "failed"
    assert body["failedAtPhase"] == "syntax"
    assert body["ast"] is None
    assert len(body["diagnostics"]) == 1
    assert body["diagnostics"][0]["phase"] == "syntax"


def test_compile_detects_any_undeclared_identifier_not_just_the_demo_one():
    """Sprint 12: semantic analysis is real now -- this must work for
    ANY undeclared name, not just the one 'undeclared_demo' string the
    pipeline used to hardcode-match on before Sprint 12."""
    response = client.post(
        "/api/v1/compile",
        json={"source": "int main() { return some_totally_different_name; }"},
    )
    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "failed"
    assert body["failedAtPhase"] == "semantic"
    assert "some_totally_different_name" in body["diagnostics"][0]["message"]


def test_compile_duplicate_declaration_end_to_end():
    response = client.post(
        "/api/v1/compile",
        json={"source": "int main() {\n  int x = 1;\n  int x = 2;\n  return x;\n}"},
    )
    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "failed"
    assert body["failedAtPhase"] == "semantic"
    assert "already declared" in body["diagnostics"][0]["message"]
    assert len(body["symbolTable"]) == 1


def test_compile_empty_source_returns_400():
    response = client.post("/api/v1/compile", json={"source": "   "})
    assert response.status_code == 400


def test_get_grammar_success():
    response = client.get("/api/v1/grammar/c-like-v1")
    assert response.status_code == 200
    body = response.json()
    assert body["id"] == "c-like-v1"
    assert len(body["productions"]) > 0


def test_get_grammar_not_found():
    response = client.get("/api/v1/grammar/nonexistent")
    assert response.status_code == 404


def test_get_history():
    response = client.get("/api/v1/history/proj_42")
    assert response.status_code == 200
    body = response.json()
    assert body["total"] >= 1
    assert all(item["projectId"] == "proj_42" for item in body["items"])


def test_get_history_unknown_project_returns_empty():
    response = client.get("/api/v1/history/proj_does_not_exist")
    assert response.status_code == 200
    assert response.json() == {"total": 0, "items": []}
