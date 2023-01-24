import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';


const idb = window.indexedDB || window.mozIndexDB || window.webkitIndexDB || window.msIndexDB ||
  window.shinIndexDB;

const createCollectionInIndexDB = () => {
  console.log(idb)
  if (!idb) {
    console.log("YOU BRowser not support")
    return;
  }

  const request = idb.open("test-db", 1);
  request.onerror = (e) => {
    console.log(e)
  }

  request.onupgradeneeded = (e) => {
    const db = request.result;
    if (!db.objectStoreNames.contains('usrData')) {
      db.createObjectStore('userData', {
        keyPath: 'id',
      })
    }
  }

  request.onsuccess = () => {
    console.log('db creates')
  }
}
function App() {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [mail, setMain] = useState('');

  useEffect(() => {
    createCollectionInIndexDB()
  }, [])

  const handleSubmit=(e)=>{
    const dbpromis= idb.open("test-db", 1)

    if(firstname&&lastname && mail){
      dbpromis.onsuccess=()=>{
        const db= dbpromis.result;
        const tx= db.transaction('userData','readwrite');
        const userData=tx.objectStore('userData');

        const users= userData.put({
          id:1,
          firstname,
          lastname,
          mail

        })

        users.onsuccess=()=>{
          tx.oncomplete=()=>{
            db.close();
          }
        }

        users.error=(e)=>{
          console.log(e)
        }
      }
    }

  }

  return (
    <div className="App d-flex">
      <div className='row w-50'>
        <div className='col-md-6'>
          <button className='btn btn-primary'>ADD +</button>
        </div>
        <table className='table bordered'>
          <thead>
            <tr>
              <th>fname</th>
              <th>lname</th>
              <th>email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td>
                <button className='btn btn-success'>Edit</button>
                <button className='btn btn-danger'>Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className='col-md-6'>
        <div className='card px-4 py-3'>
          <h2>Add User</h2>
          <div className='fom-group'>
            <label>First name</label>
            <input type='text' className='form-control' onChange={(e) => {
              setLastname(e.target.value)
            }} value={firstname}/>

          </div>

          <div className='fom-group'>
            <label>Last name</label>
            <input type='text' className='form-control' onChange={(e) => {
              setFirstname(e.target.value)
            }} value={lastname}/>

          </div>
          <div className='fom-group'>
            <label>Email</label>
            <input type='email' className='form-control' onChange={(e) => {
              setMain(e.target.value)
            }} value={mail}/>

          </div>
          <div className='form-group'>
            <button className='btn btn-info float-right mt-2' onClick={handleSubmit}>Add</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
