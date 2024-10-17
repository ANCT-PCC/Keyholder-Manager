import sqlite3,json,datetime
import random,string
import json
import subprocess

DB_NAME='keyholder.db'
TABLE_NAME = 'main_table'

INIT_SQL_COMMAND = f'''
    CREATE TABLE IF NOT EXISTS "{TABLE_NAME}"(uid,submit_time,receipt_id,front,back,is_completed,is_delivered)
'''

#汎用SQL実行
def sqlExecute(mode:bool,sql:str):
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute(sql)
    res=c.fetchall()

    if mode == True:
        #書き込みモード
        print("\n[Notice]\t書き込みモードで実行しました")
        conn.commit()
    else:
        print("\n[Notice]\t書き込みモードで実行していません")
        pass

    conn.close()
    return res

def add_task(receipt_id:str,front:str,back:str):
    cmd = f'''
        INSERT INTO "{TABLE_NAME}" VALUES(?,?,?,?,?,?,?)
    '''
    uid = '0'
    submit_time = datetime.datetime.now().strftime('%Y年%m月%d日 %H:%M')
    data = (uid,submit_time,receipt_id,front,back,'False','False')
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute(cmd,data)
    conn.commit()
    c.close()

def delete_task(receipt_id:str):
    cmd = f'''
        delete from "{TABLE_NAME}" where receipt_id == "{receipt_id}"
    '''
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute(cmd)
    conn.commit()
    c.close()

def complete_task(receipt_id):
    cmd = f'''
        update "{TABLE_NAME}" set is_completed = "True" where receipt_id = "{receipt_id}" 
    '''
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute(cmd)
    conn.commit()
    c.close()

def retry_task(receipt_id:str,front:str,back:str):
    new_rid = receipt_id+'R'
    add_task(new_rid,front=front,back=back)
    delete_task(receipt_id=receipt_id)

def confirm_task(receipt_id:str):
    cmd = f'''
        update "{TABLE_NAME}" set is_delivered = "True" where receipt_id = "{receipt_id}" 
    '''
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute(cmd)
    conn.commit()
    c.close()    
