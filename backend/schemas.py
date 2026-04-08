from pydantic import BaseModel
from decimal import Decimal
from typing import List

class Coin(BaseModel):
    symbol: str
    amt: str
    
class AnalyzeRequest(BaseModel):
    coins: List[Coin]
    days: str