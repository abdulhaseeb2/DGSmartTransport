# Imports
from datetime import datetime
import json
from web3 import Web3
import math 
from pydrive.auth import GoogleAuth
from pydrive.drive import GoogleDrive

# web3.py instance
w3 = Web3(Web3.HTTPProvider("http://127.0.0.1:7545"))
w3.isConnected()

# Check the Use of api_key
api_key = 'AIzaSyAxF3aGEjiG3EJ2R1vBCwH7zEoRb2gNSIc'

g_login = GoogleAuth()
g_login.LocalWebserverAuth()
drive = GoogleDrive(g_login)

# POTHOLE FOLDER ID
phf_ID = "1J1dhcR1UEB4FM8Rtm5-8pO2hh2--eWJM"


# Setting up the Smart Contract Details
abi = json.loads('[{"constant":true,"inputs":[],"name":"damageCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"reported","outputs":[{"name":"damType","type":"string"},{"name":"URL","type":"string"},{"name":"lat","type":"string"},{"name":"long","type":"string"},{"name":"priority","type":"int256"},{"name":"damageReportCount","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_damTy","type":"string"},{"name":"_URL","type":"string"},{"name":"_lat","type":"string"},{"name":"_long","type":"string"},{"name":"_date","type":"string"}],"name":"newDamage","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_index","type":"uint256"},{"name":"_pri","type":"int256"},{"name":"_date","type":"string"}],"name":"append","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_index","type":"uint256"}],"name":"getDamage","outputs":[{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_index","type":"uint256"}],"name":"getDamageImg","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_index","type":"uint256"}],"name":"popFULL","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_index","type":"uint256"}],"name":"deleteDamage","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]')
addr = "0x9c239640D1F35d5c06454121CD392566602389F6"

# Getting the SmartContract Object
contract = w3.eth.contract(address=addr, abi=abi)

# Sender Details
wallet_addr='0x9d31E9B46aF05D95ee96C0A85eF11B77e99657CA'
wallet_private_key='9393f03fc4df5c7f19c173e002a6cd837093d4a04a11a858b4db3f6ea7558e09'


# Report a New RoadDamage on The Ethereum Network
def addDamage(damage, img, lat, long):
    nonce = w3.eth.getTransactionCount(wallet_addr)

    now = datetime.now() # current date and time
    date_time = now.strftime("%m/%d/%Y, %H:%M:%S")
    
    img_id = driveUpload(img)
    
    txn_dict = contract.functions.newDamage(damage, img_id, lat, long, date_time).buildTransaction({
        'gas': 1400000,
        'gasPrice': w3.toWei('40', 'gwei'),
        'nonce': nonce,
    })

    signed_txn = w3.eth.account.signTransaction(txn_dict, private_key=wallet_private_key)

    result = w3.eth.sendRawTransaction(signed_txn.rawTransaction)

    tx_receipt = w3.eth.getTransactionReceipt(result)

    count = 0
    while tx_receipt is None and (count < 30):

        time.sleep(10)

        tx_receipt = w3.eth.getTransactionReceipt(result)

        print(tx_receipt)

# Append Damage in an Existing Reported RoadDamage
def appendDamage(index, lat, long):
    nonce = w3.eth.getTransactionCount(wallet_addr)

    now = datetime.now() # current date and time
    date_time = now.strftime("%m/%d/%Y, %H:%M:%S")

    #Priority Code Goes Here
    priority = 5

    txn_dict = contract.functions.append(index, priority, date_time).buildTransaction({
        'gas': 1400000,
        'gasPrice': w3.toWei('40', 'gwei'),
        'nonce': nonce,
    })

    signed_txn = w3.eth.account.signTransaction(txn_dict, private_key=wallet_private_key)

    result = w3.eth.sendRawTransaction(signed_txn.rawTransaction)

    tx_receipt = w3.eth.getTransactionReceipt(result)

    count = 0
    while tx_receipt is None and (count < 30):

        time.sleep(10)

        tx_receipt = w3.eth.getTransactionReceipt(result)

        print(tx_receipt)

# Removing Fixed RoadDamages
def deleteDamage(index):
    nonce = w3.eth.getTransactionCount(wallet_addr)
    
    txn_dict = contract.functions.deleteDamage(index).buildTransaction({
        'gas': 1400000,
        'gasPrice': w3.toWei('40', 'gwei'),
        'nonce': nonce,
    })

    signed_txn = w3.eth.account.signTransaction(txn_dict, private_key=wallet_private_key)

    result = w3.eth.sendRawTransaction(signed_txn.rawTransaction)

    tx_receipt = w3.eth.getTransactionReceipt(result)

    count = 0
    while tx_receipt is None and (count < 30):

        time.sleep(10)

        tx_receipt = w3.eth.getTransactionReceipt(result)

        print(tx_receipt)


# Generally used geo measurement function
def measure(lat1, lon1, lat2, lon2):
    pi = math.pi
    R = 6378.137 # Radius of earth in KM
    dLat = lat2 * pi / 180 - lat1 * pi / 180
    dLon = lon2 * pi / 180 - lon1 * pi / 180
    a = math.sin(dLat/2) * math.sin(dLat/2) + math.cos(lat1 * pi / 180) * math.cos(lat2 * pi / 180) * math.sin(dLon/2) * math.sin(dLon/2)
    c = 2 * math.atan2(a**0.5, (1-a)**0.5)
    d = R * c
    return d * 1000 # meters


print(measure(33.5737876,73.1476946,33.5739943,73.1481049))

# Upload Image to GoogleDrive
def driveUpload(folder_ID, img):
    file = drive.CreateFile({"parents": [{"kind": "drive#fileLink", "id": folder_ID}]})
    file.SetContentFile(img)
    file.Upload()
    print('Created file %s with mimeType %s' % (file['title'],
    file['mimeType']))
    return file['id']


# Download Image from GoogleDrive
def driveDownload(img_id, img_Name):
    file = drive.CreateFile({'id': img_id})
    print('Downloading file from Google Drive')
    file.GetContentFile(img_Name)

# Delete Image from GoogleDrive
def driveDelete(img_id):
    file = drive.CreateFile({'id': img_id})

    file.Trash()  # Move file to trash.
    file.UnTrash()  # Move file out of trash.
    file.Delete()  # Permanently delete the file.


def main():
    print()
    #Some ML Code Goes here
    #Image is assumed tobe saved on the system
    #lat/long are read
    lat = 33.5737876
    longi = 73.1476946
    img = "img4.jpg"
    damagetype = "PotHole"
    found = False
    
    for (i in range(contract.functions.getCount().call())):
        damage = contract.funtions.getDamage(i).call()
        
        #checks the distance between 2 coordinates is less than 10m or not
        if (measure(lat, longi, float(damage[1]), float(damage[2])) <= 10):
            found = True
            appendDamage(i)
            break
            
    #if the reported damage does not exist create a new entry
    if (!found):
        addDamage(damagetype, img, lat, longi)
        
    #image saved onthe system is deleted

if __name__== "__main__":
    main()