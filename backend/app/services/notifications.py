import httpx

from app.core.config import get_settings


async def send_slack(text: str) -> bool:
    settings = get_settings()
    if not settings.slack_webhook_url:
        return False
    async with httpx.AsyncClient(timeout=20.0) as client:
        r = await client.post(settings.slack_webhook_url, json={"text": text})
        return r.is_success


async def send_telegram(text: str) -> bool:
    settings = get_settings()
    if not (settings.telegram_bot_token and settings.telegram_chat_id):
        return False
    url = f"https://api.telegram.org/bot{settings.telegram_bot_token}/sendMessage"
    async with httpx.AsyncClient(timeout=20.0) as client:
        r = await client.post(
            url,
            json={"chat_id": settings.telegram_chat_id, "text": text[:4000]},
        )
        return r.is_success


async def send_whatsapp_twilio(text: str) -> bool:
    settings = get_settings()
    if not (
        settings.twilio_account_sid
        and settings.twilio_auth_token
        and settings.twilio_whatsapp_from
        and settings.twilio_whatsapp_to
    ):
        return False
    url = f"https://api.twilio.com/2010-04-01/Accounts/{settings.twilio_account_sid}/Messages.json"
    auth = (settings.twilio_account_sid, settings.twilio_auth_token)
    data = {
        "From": settings.twilio_whatsapp_from,
        "To": settings.twilio_whatsapp_to,
        "Body": text[:1600],
    }
    async with httpx.AsyncClient(timeout=30.0) as client:
        r = await client.post(url, data=data, auth=auth)
        return r.is_success


async def deliver_report(title: str, body: str, channels: list[str] | None = None) -> dict[str, bool]:
    """channels: slack | telegram | whatsapp — default all configured."""
    settings = get_settings()
    if channels is None:
        channels = []
        if settings.slack_webhook_url:
            channels.append("slack")
        if settings.telegram_bot_token and settings.telegram_chat_id:
            channels.append("telegram")
        if (
            settings.twilio_account_sid
            and settings.twilio_auth_token
            and settings.twilio_whatsapp_from
            and settings.twilio_whatsapp_to
        ):
            channels.append("whatsapp")

    text = f"*{title}*\n\n{body}" if "slack" in channels else f"{title}\n\n{body}"
    results: dict[str, bool] = {}
    for ch in channels:
        if ch == "slack":
            results["slack"] = await send_slack(text)
        elif ch == "telegram":
            results["telegram"] = await send_telegram(f"{title}\n\n{body}")
        elif ch == "whatsapp":
            results["whatsapp"] = await send_whatsapp_twilio(f"{title}\n\n{body}")
    return results
