"""A2A Agent Card schemas (teaching / reference implementation)."""

from __future__ import annotations

from pydantic import BaseModel, Field


class AgentSkill(BaseModel):
    id: str
    name: str
    description: str
    tags: list[str] = Field(default_factory=list)


class AgentCapabilities(BaseModel):
    streaming: bool = True
    pushNotifications: bool = False
    stateTransitionHistory: bool = True


class AgentCard(BaseModel):
    """Subset of Google A2A Agent Card — in-process delegation today; A2A HTTP peer future."""

    name: str
    description: str
    url: str
    version: str = "0.3.0"
    protocolVersion: str = "0.2.0"
    capabilities: AgentCapabilities = Field(default_factory=AgentCapabilities)
    defaultInputModes: list[str] = Field(default_factory=lambda: ["text"])
    defaultOutputModes: list[str] = Field(default_factory=lambda: ["text"])
    skills: list[AgentSkill] = Field(default_factory=list)
