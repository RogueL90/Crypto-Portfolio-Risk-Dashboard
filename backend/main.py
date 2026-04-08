from fastapi import FastAPI
from schemas import AnalyzeRequest
from db import get_connection
from fastapi import HTTPException

app = FastAPI()

# post a request
@app.post("/addrequest")
def addRequest(body: AnalyzeRequest):
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
    