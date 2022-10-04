// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Todo {
    struct TodoList{
        string name;
        bool isDone;
    }

    event AddTask(address _from, string _name);
    event DeleteTask(address _from, uint _index);
    event UpdateTask(address _from, string _name);

    mapping (address=> TodoList[]) tasksList;

    //we used calldata here as we are not modifing anything in this task
    function addTask(string calldata taskName) public {
        TodoList memory task = TodoList({name: taskName, isDone:false});
        tasksList[msg.sender].push(task);
        emit AddTask(msg.sender, taskName);
    }

    function updateTask(uint _index, string memory _name) public {
         tasksList[msg.sender][_index].name = _name;
          emit UpdateTask(msg.sender, _name);
    }

    function deleteTask(uint _index) public {
        uint length = tasksList[msg.sender].length;
        if (_index >= length) return;

        for (uint i = _index; i<length-1; i++){
            tasksList[msg.sender][i] = tasksList[msg.sender][i+1];
        }
        tasksList[msg.sender].pop();
        //delete tasksList[msg.sender][_index];
        emit DeleteTask(msg.sender, _index);
    }

    function markDoneTask(uint _index) public {
        tasksList[msg.sender][_index].isDone = !tasksList[msg.sender][_index].isDone;
    }

    function getAllTask() public view returns(TodoList[] memory) {
        return tasksList[msg.sender];
    }
 }