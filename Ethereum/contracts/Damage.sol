pragma solidity ^0.5.8;

contract Damage {
    
    //state variable
    //Structure to store Damage report Details
    uint public damageCount;
    mapping(uint => RoadDamage) public reported;
    //Structure to Store Deleted Damage report Details
    uint public deleteCount;
    mapping(uint => RoadDamage) public deleted;


    struct RoadDamage {
        string damType;
        string URL;
        string lat;
        string long;
        string[] date;
        int dash;
        int app;
        int priority;
        uint damageReportCount;
    }

    //Getter Function for damageCount
    function getDamageCount() public view returns(uint){
        return damageCount;
    }

    //Getter Funtion for DeleteCount
    function getDeleteCount() public view returns(uint){
        return deleteCount;
    }

    //Getter Funtion for is reported from Dash
    function reportedFromDash(uint _index) public view returns(int){
        //Validation Check for Recieved Index
        if (_index <= damageCount && _index != 0) {
            //Type, Lat, Long is sent
            return (reported[_index].dash);
        }
        //Default blank values will be sent if index isnt found
        return 0;
    }

    ////Getter Funtion for is reported from  App
    function reportedFromApp(uint _index) public view returns(int){
        //Validation Check for Recieved Index
        if (_index <= damageCount && _index != 0) {
            //Type, Lat, Long is sent
            return (reported[_index].app);
        }
        //Default blank values will be sent if index isnt found
        return 0;
    }

    //For new Damages to be Reported
    function newDamage(string memory _damTy, string memory _URL, string memory _lat, string memory _long, string memory _date, int _dash, int _app) public {
        damageCount ++;
        //New Damage Instance Created
        reported[damageCount] = RoadDamage(_damTy, _URL, _lat, _long, new string[](0), _dash, _app, 0, 1);
        reported[damageCount].date.push(_date);
        reported[damageCount].damageReportCount = 1;
    }

    //For Already Existing Damages
    function append(uint _index, int _pri, string memory _date) public {
        //Validation Check for Recieved Index
        if (_index <= damageCount && _index != 0) {

            reported[_index].damageReportCount += 1;
            reported[_index].date.push(_date);

            //Default setting for Priority Update
            if (reported[_index].damageReportCount % 2 == 0 && keccak256(abi.encodePacked(reported[_index].damType)) != keccak256(abi.encodePacked("PotHole"))) {
                //If Priority isn't Maxed out then Increment
                if (reported[_index].priority<5)
                {
                    reported[_index].priority += 1;
                }
            }
            else {
                //If Priority isn't Maxed out then Increment
                if (reported[_index].priority<5)
                {
                    reported[_index].priority += 1;
                }
            }
        }
    }

    //Getter for Returning Filtered Damage report Data
    function getDamage(uint _index) public view  returns (string memory, string memory, string memory) {
        //Validation Check for Recieved Index
        if (_index <= damageCount && _index != 0) {
            //Type, Lat, Long is sent
            return (reported[_index].damType, reported[_index].lat, reported[_index].long);
        }
        //Default blank values will be sent if index isnt found
        return ("", "", "");
    }

    //Getter for Returning all of Damage report Data
    function getAllData(uint _index)public view returns(string memory, string memory, string memory, string memory, int, int, int){
        //Validation Check for Recieved Index
        if (_index <= damageCount && _index != 0) {
            //Everything sent except DateArray
            return (reported[_index].damType,reported[_index].URL, reported[_index].lat, reported[_index].long, reported[_index].priority,reported[_index].dash,reported[_index].app);
        }
        //Default blank values will be sent if index isnt found
        return ("", "", "", "", 0, 0, 0);
    }

    //Return Image URL
    function getDamageImg(uint _index) public view returns (string memory){
        //Validation Check for Recieved Index
        if (_index <= damageCount && _index != 0) {
            return (reported[_index].URL);
        }
        //Default blank values will be sent if index isnt found
        return ("");
    }


    function deleteDamage(uint _index) public {
        //Validation Check for Recieved Index
        if (_index <= damageCount && _index != 0) {
            
            //Save Delete History
            saveDeleteHistory(_index);

            //data from last index is swapped with data with given index
            reported[_index].damType = reported[damageCount].damType;
            reported[_index].URL = reported[damageCount].URL;
            reported[_index].lat = reported[damageCount].lat;
            reported[_index].long = reported[damageCount].long;
            reported[_index].date = reported[damageCount].date;
            reported[_index].dash = reported[damageCount].dash;
            reported[_index].app = reported[damageCount].app;
            reported[_index].damageReportCount = reported[damageCount].damageReportCount;

            //index is deleted and damageCount is Decremented
            delete reported[damageCount];
            damageCount --;
        }
    }

    //Saves the deleted Damage report
    function saveDeleteHistory(uint _index) private {
        deleteCount ++;
        //New Delete Instance Created
        deleted[deleteCount] = RoadDamage(reported[_index].damType, reported[_index].URL, reported[_index].lat, reported[_index].long, new string[](0), reported[_index].dash, reported[_index].app, 0, 0);
        deleted[deleteCount].date.push(reported[_index].date[0]);
        deleted[deleteCount].damageReportCount = reported[_index].damageReportCount;
        deleted[deleteCount].priority = reported[_index].priority;
    }

    //Undo Funtionality for Delete
    function undoDelete(uint _index) public {
        //Validation Check for Recieved Index
        if (_index <= deleteCount && _index != 0) {
            damageCount ++;
            //New Damage Instance Created
            reported[damageCount] = RoadDamage(deleted[_index].damType, deleted[_index].URL, deleted[_index].lat, deleted[_index].long, new string[](0), reported[_index].dash, reported[_index].app, 0, 0);
            reported[damageCount].date.push(deleted[_index].date[0]);
            reported[damageCount].damageReportCount = deleted[_index].damageReportCount;
            reported[damageCount].priority = deleted[_index].priority;

            //data from last index is swapped with data with given index
            deleted[_index].damType = deleted[deleteCount].damType;
            deleted[_index].URL = deleted[deleteCount].URL;
            deleted[_index].lat = deleted[deleteCount].lat;
            deleted[_index].long = deleted[deleteCount].long;
            deleted[_index].date = deleted[deleteCount].date;
            deleted[_index].dash = deleted[deleteCount].dash;
            deleted[_index].app = deleted[deleteCount].app;
            deleted[_index].damageReportCount = deleted[deleteCount].damageReportCount;

            //index is deleted and deleteCount is Decremented
            delete deleted[deleteCount];
            deleteCount --;
        }
    }

        //Getter for Returning all of Deleted Damage report Data
        function getDeleteData(uint _index)public view returns(string memory, string memory, string memory, string memory, int, string memory){
            //Validation Check for Recieved Index
            if (_index <= deleteCount && _index != 0) {
                //Everything sent
                return (deleted[_index].damType, deleted[_index].URL, deleted[_index].lat, deleted[_index].long, deleted[_index].priority, deleted[_index].date[0]);
            }
            //Default blank values will be sent if index isnt found
            return ("", "", "", "", 0, "");
        }

        //Return Image URL
        function getDeleteImg(uint _index) public view returns (string memory){
            //Validation Check for Recieved Index
            if (_index <= deleteCount && _index != 0) {
                return (deleted[_index].URL);
            }
            //Default blank values will be sent if index isnt found
            return ("");
        }
}