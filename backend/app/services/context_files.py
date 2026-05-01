from pathlib import Path

from app.core.config import get_settings


def read_optional_file(rel_setting: str | None) -> str:
    if not rel_setting:
        return "(no contextual file configured)"
    path = Path(rel_setting).expanduser()
    if not path.is_file():
        return f"(file not found: {path})"
    try:
        return path.read_text(encoding="utf-8")[:12000]
    except OSError as exc:
        return f"(unable to read file: {exc})"


def calendar_context() -> str:
    return read_optional_file(get_settings().calendar_context_path)


def budget_context() -> str:
    return read_optional_file(get_settings().budget_summary_path)


def meeting_context() -> str:
    return read_optional_file(get_settings().meeting_context_path)
