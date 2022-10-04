import './App.css';
import {ethers} from 'ethers';
import { Component } from 'react';
import contractABI from './contract-abi.json'

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      provider: null,
      account: null,
      contract: null,
      taskName: '',
      taskList: null,
    }
  }

  async componentDidMount() {
    await this.loadWallet();
    await this.setContract();
  };

  loadWallet = async () => {
    // A Web3Provider wraps a standard Web3 provider, which is
    // what MetaMask injects as window.ethereum into each page
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    // // MetaMask requires requesting permission to connect users accounts
    await provider.send("eth_requestAccounts", []);

    const accounts = await provider.listAccounts();
    const account = accounts[0];
    this.setState({provider: provider, account: account});

    let balance = await provider.getBalance(account);
    console.log(balance);
  }

  setContract = async() => {
    const provider = this.state.provider;
    const contractAddress = "0x79600f09D95ac303F52909bD5dA7CAf4Cc0966F1";
    
    const signer = await provider.getSigner();
    const contract = await new ethers.Contract(contractAddress, contractABI, signer);
      
    this.setState({contract:contract});
  }

  addTodo = async() => {
    const contract = this.state.contract;
    await contract.addTask(this.state.taskName);
    this.setState({taskName:''});
    this.refreshTask();
  }

  refreshTask = async() => {
    const contract = this.state.contract;
    const tasks = await contract.getAllTask();
    console.log(tasks);
    const taskList = tasks.map((task, index) => (
      <div key={index}>
        <input value={task} type="checkbox" onClick={async() => await this.markDone(index)}/>
        <span style={{ textDecoration: task.isDone ? "line-through" : null }}>{task.name}</span>
        <button onClick={async() => await this.deleteTodo(index)}>Delete</button>
        <button onClick={async() => await this.updateTask(index,'Hitesh Task')}>Update</button>
      </div>
    ));

    this.setState({taskList: taskList});
  }

  deleteTodo = async(index) => {
    const contract = this.state.contract;
    await contract.deleteTask(index);
  }

  updateTask = async(index, name) => {
    const contract = this.state.contract;
    await contract.updateTask(index, name);
  }

  markDone = async (index) => {
    const contract = this.state.contract;
    await contract.markDoneTask(index);
  }

  handleChange = event => {
    this.setState({taskName:event.target.value});
  };


  // sayHello = async() => {
  //   const contract = this.state.contract;
  //   const hello = await contract.getHello();
  // }

  render() {
    return (
      <div className="App">
        
          Hello {this.state.account}
          <div>
          <div>
            <input type="text" id="message" name="message" onChange={this.handleChange} value={this.state.taskName} autoComplete="off"></input>
            <button onClick={this.addTodo}>Add To TODO</button>
            <button onClick={this.refreshTask}>Refresh Task List</button>
          </div>
          {this.state.taskList}
          </div>
      </div>
    );
  };
}

export default App;
