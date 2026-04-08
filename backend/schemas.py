from pydantic import BaseModel

class Coin(BaseModel):
    symbol: str
    amt: str
    
class AddRequest(BaseModel):
    coins: list[Coin]
    days: str
    