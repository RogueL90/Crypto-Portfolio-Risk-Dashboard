from db import get_connection

con = get_connection()

try:
    cur = con.cursor()
    cur.execute("SELECT 1 AS OK")
    res = cur.fetchone()
    print(res)
finally:
    con.close()