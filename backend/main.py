from fastapi import FastAPI
from schemas import AddRequest
from db import get_connection
from fastapi import HTTPException
from getstats import getStats
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# post a request
@app.post("/addrequest")
def addRequest(body: AddRequest):
    con = get_connection()
    cur = None
    requestId = None
    try: 
        cur = con.cursor()
        cur.execute(
            """
            INSERT INTO requests(days)
            VALUES(%s)
            """,
            (int(body.days),)
        )
        requestId = cur.lastrowid
        for currCoin in body.coins:
            cur.execute(
            """
            INSERT INTO Coins(symbol, amt, request_id)
            VALUES(
                %s,%s,%s
            )
            """,
            (currCoin.symbol,float(currCoin.amt),requestId)
        )
        con.commit()
    except Exception: 
        con.rollback()
        raise HTTPException(status_code=500, detail="Database error")
    finally:
        if cur:
            cur.close()
        con.close()
    return {"requestId": requestId, "days": body.days}

# return request table ID and days
@app.get("/requests")
def sendRequests():
    con = get_connection()
    cur = None
    requests = []
    try:
        cur = con.cursor()
        cur.execute("""
                    SELECT id, days FROM requests
                    """)
        requests = cur.fetchall()
    except Exception:
        con.rollback()
        raise HTTPException(status_code=500, detail="Database error")
    finally:
        if cur: 
            cur.close()
        con.close()
    return {"requests": requests}
    
# return analysis of request
@app.get("/analysis/{requestId}")
def analyze(requestId: int):
    con = get_connection()
    cur = None
    coins = []
    days = 0
    try:
        cur = con.cursor()
        cur.execute("""
                    SELECT symbol, amt FROM Coins
                    WHERE request_id = %s
                    """, (requestId,))
        coins = cur.fetchall()
        cur.execute("""
                    SELECT days FROM requests
                    WHERE id = %s
                    """, (requestId))
        days = cur.fetchone()
    except Exception:
        raise HTTPException(status_code=500, detail="Database error")
    finally:
        if cur: 
            cur.close()
        con.close()
    analysis = getStats(coins, days)
    return { "coins": coins, "days": days } # to change