import africastalking
import requests
from requests.adapters import HTTPAdapter
from urllib3.poolmanager import PoolManager
import ssl

# --- TLS 1.2 adapter for Python 3.13 ---
class TLS12Adapter(HTTPAdapter):
    def init_poolmanager(self, *args, **kwargs):
        ctx = ssl.SSLContext(ssl.PROTOCOL_TLS_CLIENT)
        ctx.options |= ssl.OP_NO_TLSv1 | ssl.OP_NO_TLSv1_1  # disable old versions
        ctx.minimum_version = ssl.TLSVersion.TLSv1_2
        ctx.maximum_version = ssl.TLSVersion.TLSv1_2
        kwargs['ssl_context'] = ctx
        return super().init_poolmanager(*args, **kwargs)

# --- Patch requests globally ---
session = requests.Session()
session.mount("https://", TLS12Adapter())

# --- Africa's Talking setup ---
username = "sandbox"
api_key = "atsk_0014870eb79bd245362afdeb18771f2d8c3c6a4c7f02a822b168de67607ee133cf7d05ae"  # replace with your sandbox key

africastalking.initialize(username, api_key)
sms = africastalking.SMS

recipients = ["+254758743522"]  # replace with your number
message = "Test SMS from Africa's Talking Sandbox (TLS 1.2 enforced)."

try:
    response = sms.send(message, recipients)
    print("✅ SMS sent successfully:", response)
except Exception as e:
    print("❌ Error sending SMS:", e)
