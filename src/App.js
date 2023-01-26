import './App.css';
import { useEffect, useState } from 'react';


const idb = window.indexedDB || window.mozIndexDB || window.webkitIndexDB || window.msIndexDB ||
  window.shinIndexDB;

const createCollectionInIndexDB = () => {
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
    console.log('db created')
  }
}

function App() {
  const [add, setAdd] = useState(false)
  const [edit, setEdit] = useState(false)
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [mail, setMain] = useState('');
  const [allUserData, setAllUserData] = useState([]);
  const [selectedUser, setSelectedUser] = useState({})

  useEffect(() => {
    createCollectionInIndexDB()
    getAllData()
  }, [])


  const getAllData = () => {
    const dbpromis = idb.open("test-db", 1)
    dbpromis.onsuccess = () => {
      const db = dbpromis.result;
      const tx = db.transaction('userData', 'readonly');
      const userData = tx.objectStore('userData');

      const users = userData.getAll()
      users.onsuccess = (query) => {
        setAllUserData(query.srcElement.result)
      }

      users.onerror = (e) => {
        console.log(e)
      }

      tx.oncomplete = () => {
        db.close();
      }

    }
  }
  const handleSubmit = (e) => {
    const dbpromis = idb.open("test-db", 1)

    if (firstname && lastname && mail) {
      dbpromis.onsuccess = () => {
        const db = dbpromis.result;
        const tx = db.transaction('userData', 'readwrite');
        const userData = tx.objectStore('userData');

        if (add) {
          const users = userData.put({
            id: allUserData?.length + 1,
            firstname,
            lastname,
            mail
          })

          users.onsuccess = () => {
            tx.oncomplete = () => {
              db.close();
            }
            alert('Added');
            getAllData()
          }

          users.onerror = (e) => {
            console.log(e)
          }
        }
        else {
          const users = userData.put({
            id: selectedUser.id,
            firstname,
            lastname,
            mail
          })

          users.onsuccess = () => {
            tx.oncomplete = () => {
              db.close();
            }
            alert('Updated');
            getAllData()
          }

          users.onerror = (e) => {
            console.log(e)
          }
        }
      }
    }

  }

  const handleEdit = (ele) => {
    setAdd(false)
    setEdit(true)
    setSelectedUser(ele)
    setFirstname(ele.firstname)
    setLastname(ele.lastname)
    setMain(ele.mail)
  }
  const handleDelete = (userd) => {
    const dbpromis = idb.open("test-db", 1)
    dbpromis.onsuccess = () => {
      const db = dbpromis.result;
      const tx = db.transaction('userData', 'readwrite');
      const userData = tx.objectStore('userData');

      const users = userData.delete(userd.id)
      users.onsuccess = (query) => {
        alert('User Deleted')
        getAllData()
      }

      users.onerror = (e) => {
        console.log(e)
      }

      tx.oncomplete = () => {
        db.close();
      }

    }
  }

  return (
    <div className="App d-flex">
      <div className='row w-50'>
        <div className='col-md-6'>
          <button className='btn btn-primary' onClick={() => { setEdit(false); setAdd(true) }}>ADD +</button>
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
            {
              allUserData.map((val, index) => (
                <tr key={index}>
                  <td>{val.firstname}</td>
                  <td>{val.lastname}</td>
                  <td>{val.mail}</td>
                  <td>
                    <button className='btn btn-success' onClick={() => { handleEdit(val) }}>Edit</button>
                    <button className='btn btn-danger' onClick={() => { handleDelete(val) }}>Delete</button>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
      <div className='col-md-6'>
        {
          edit || add ?
            <div className='card px-4 py-3'>
              <h2>{edit ? 'Update' : 'Add'} User</h2>
              <div className='fom-group'>
                <label>First name</label>
                <input type='text' className='form-control' onChange={(e) => {
                  setFirstname(e.target.value)
                }} value={firstname} />

              </div>

              <div className='fom-group'>
                <label>Last name</label>
                <input type='text' className='form-control' onChange={(e) => {
                  setLastname(e.target.value)
                }} value={lastname} />

              </div>
              <div className='fom-group'>
                <label>Email</label>
                <input type='email' className='form-control' onChange={(e) => {
                  setMain(e.target.value)
                }} value={mail} />

              </div>
              <div className='form-group'>
                <button className='btn btn-info float-right mt-2' onClick={handleSubmit}>
                  {edit ? 'Update' : 'Add'}</button>
              </div>
            </div>
            : null
        }
      </div>
    </div>
  );
}

export default App;
