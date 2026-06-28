"""Tests for loop pattern parsing."""

from app.agents.loops.reflection_loop import _parse_score


def test_parse_score():
    assert _parse_score("Quality score: 8/10") == 8.0
    assert _parse_score("Score: 6.5/10") == 6.5
    assert _parse_score("no score here") == 5.0
