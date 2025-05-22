import { useState, useEffect } from 'react';
import axios from 'axios';
import Configuration from '@/services/lib/config';
import Link from 'next/link'

export default function PageListItems({
  endpoint,
  headers = [],
  permissions=['GET','POST','PUT','DELETE'],
  createButtonText = "Create",
}) {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAlert, setShowAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showJSONModal, setShowJSONModal] = useState(false);
  const [currentJSONData, setCurrentJSONData] = useState(null);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const axiosConfig = () => {
    const token = localStorage.getItem('token');
    
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  };

  const getRelationHeaders = headers => {
    return headers.filter(header => header.isRelation).map(header => header.key);
  };

  const updateCurrentItem = (key, value, isRelation = false) => {
    let newItem;
    if (isRelation) {
      newItem = {
        ...currentItem,
        relations: {
          ...currentItem.relations,
          [key]: value,
        },
      };
    } else {
      newItem = { ...currentItem, [key]: value };
    }
    setCurrentItem(newItem);
  };
  
  useEffect(() => {
    const relationHeaders = getRelationHeaders(headers).join(',');
    axios.get(`${Configuration.backendEndpoint + endpoint}?include=${relationHeaders}`, axiosConfig())
      .then(response => setItems(response.data))
      .catch(error => console.error(error));
  }, []);

  const onEdit = () => {
    const { relations, ...otherFields } = currentItem;
    const updateData = {
      ...otherFields,
      ...Object.fromEntries(getRelationHeaders(headers).map(key => [key, relations[key]]))
    };
    if (currentItem && currentItem.id) {
      axios.put(`${Configuration.backendEndpoint + endpoint}/${currentItem.id}`, updateData, axiosConfig())
        .then(() => {
          setItems(items.map(item => (item.id === currentItem.id ? { ...item, ...updateData } : item)));
          setShowModal(false);
        })
        .catch(error => {
          console.error(error);
          // Você pode adicionar mais lógica de tratamento de erro aqui, se necessário
        });
    }
  };
  
  const onCreate = () => {
    const { relations, ...otherFields } = currentItem;
    const createData = {
      ...otherFields,
      ...Object.fromEntries(getRelationHeaders(headers).map(key => [key, relations[key]]))
    };
    if (currentItem) {
      axios.post(Configuration.backendEndpoint + endpoint, createData, axiosConfig())
        .then(response => {
          setItems([...items, response.data]);
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 3000);
          setShowModal(false);
        })
        .catch(error => {
          console.error(error);
          // Você pode adicionar mais lógica de tratamento de erro aqui, se necessário
        });
    }
  };
  
  const onDelete = (itemToDelete) => {
    setIsLoading(true);
    setError(null);
    axios.delete(`${Configuration.backendEndpoint + endpoint}/${itemToDelete.id}`, axiosConfig())
      .then(() => {
        setItems(items.filter(item => item.id !== itemToDelete.id));
        setIsLoading(false);
      })
      .catch(error => {
        console.error(error);
        setError("An error occurred while deleting the item.");
        setIsLoading(false);
      });
  };

  const onDeleteConfirmed = () => {
    if (itemToDelete) {
      onDelete(itemToDelete);
      setShowDeleteModal(false);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const previousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  function renderModal() {
    if (!showModal) return null;
  
    const isEditing = Boolean(currentItem && currentItem.id);
  
    return (
      <div className="fixed z-10 inset-0 overflow-y-auto">
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity">
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <form>
                {headers.map((header, idx) => (
                  <>
                  {header.editable !== false && (header.key !== 'id' || isEditing) && (
                      <div key={idx} className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">{header.label}</label>
                        {(header.key !== 'id' || isEditing) && (
                          <>
                            {header.isCompany && (localStorage.getItem('ROLE') == 'USER') ? (
                              <input
                                type="text"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={(() => {
                                  updateCurrentItem(header.key, localStorage.getItem('COMPANY_ID'), true);
                                  return String(localStorage.getItem('COMPANY_ID') || '');
                                })()}
                                onChange={(e) => {
                                  updateCurrentItem(header.key, e.target.value, true);
                                }}
                              />
                            ) : header.isRelation ? (
                              <input
                                type="text"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={currentItem && currentItem.relations ? currentItem.relations[header.key] : ''}
                                onChange={(e) => {
                                  updateCurrentItem(header.key, e.target.value, true);
                                }}
                              />
                            ) : (
                              <>
                                {(header.type === 'text' || (!header.type)) && (
                                  <input
                                    type="text"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={currentItem ? currentItem[header.key] : ''}
                                    onChange={(e) => {
                                      const newItem = { ...currentItem, [header.key]: e.target.value };
                                      setCurrentItem(newItem);
                                    }}
                                  />
                                )}
                                {header.type === 'file' && (
                                  <input
                                    type="file"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    onChange={(e) => {
                                      const newItem = { ...currentItem, [header.key]: e.target.files[0] };
                                      setCurrentItem(newItem);
                                    }}
                                  />
                                )}
                                {header.type === 'date' && (
                                  <input
                                    type="date"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={currentItem && currentItem[header.key] ? new Date(currentItem[header.key]).toISOString().split('T')[0] : ''}
                                    onChange={(e) => {
                                      const newItem = { ...currentItem, [header.key]: new Date(e.target.value).toISOString() };
                                      setCurrentItem(newItem);
                                    }}
                                  />
                                )}
                                {header.type === 'select' && (
                                  <select
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={currentItem ? currentItem[header.key] : ''}
                                    onChange={(e) => {
                                      const newItem = { ...currentItem, [header.key]: e.target.value };
                                      setCurrentItem(newItem);
                                    }}
                                  >
                                    {header.options.map((option, index) => (
                                      <option key={index} value={option.value}>
                                        {option.label}
                                      </option>
                                    ))}
                                  </select>
                                )}
                                {header.type === 'CSVtoJSON' && (
                                  <input
                                    type="file"
                                    accept=".csv"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    onChange={(e) => {
                                      const file = e.target.files[0];
                                      if (file) {
                                        const reader = new FileReader();
                                        reader.readAsText(file);
                                        reader.onload = function(event) {
                                          const csv = event.target.result;
                                          const json = csvToJson(csv); // You need to implement this function
                                          const newItem = { ...currentItem, [header.key]: json };
                                          setCurrentItem(newItem);
                                        };
                                      }
                                    }}
                                  />
                                )}
                              </>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </>
                ))}
              </form>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                onClick={() => {
                  setShowModal(false);
                  if (isEditing) {
                    onEdit();
                  } else {
                    onCreate();
                  }
                }}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue sm:ml-3 sm:w-auto sm:text-sm"
              >
                Save
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue sm:mt-0 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  function csvToJson(csv) {
    const lines = csv.split('\r\n');
    const headers = lines[0].split(';');
    const jsonArr = [];
  
    for (let i = 1; i < lines.length; i++) {
      const obj = {};
      const currentline = lines[i].split(';');
      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j];
      }
      jsonArr.push(obj);
    }
  
    return JSON.stringify(jsonArr);
  }

  function renderDeleteModal() {
    if (!showDeleteModal) return null;
  
    return (
      <div className="fixed z-20 inset-0 overflow-y-auto">
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          {/* ... (background overlay) */}
          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Confirm Deletion
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete this item?
                </p>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button onClick={onDeleteConfirmed} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:border-red-700 focus:shadow-outline-red sm:ml-3 sm:w-auto sm:text-sm">
                Delete
              </button>
              <button onClick={() => setShowDeleteModal(false)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue sm:mt-0 sm:w-auto sm:text-sm">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  function renderJSONModal() {
    if (!showJSONModal) return null;
  
    // Determine the keys (column headers) from the first object, assuming all objects have the same keys.
    const keys = currentJSONData && currentJSONData.length > 0 ? Object.keys(currentJSONData[0]) : [];
  
    return (
      <div className="fixed z-30 inset-0 overflow-y-auto bg-opacity-50 bg-gray-700 flex items-center justify-center">
        <div className="relative bg-white rounded-lg w-3/4 md:w-1/2 lg:w-1/3 p-8  shadow-lg">
          <button 
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-800" 
            onClick={() => setShowJSONModal(false)}
          >
            Close
          </button>
          <h2 className="text-2xl font-semibold mb-4">JSON Data</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm bg-white border border-gray-200">
              <thead>
                <tr>
                  {keys.map((key, index) => (
                    <th key={index} className="border px-4 py-2 text-gray-600 font-semibold">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentJSONData.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {keys.map((key, colIndex) => (
                      <td key={colIndex} className="border px-4 py-2 text-gray-600">
                        {row[key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {isLoading && <div className="text-blue-600">Sending data...</div>}
      {error && <div className="text-red-600">{error}</div>}
      {showAlert && <div className="text-green-600">Item criado com sucesso!</div>}
      {permissions.includes('POST') && (
        <div className="flex justify-end mb-4">
          <button
            onClick={() => {
              setCurrentItem(null);
              setShowModal(true);
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            {createButtonText}
          </button>
        </div>
      )}
      <table className="min-w-full leading-normal">
        <thead>
          <tr>
            {headers.map((header, idx) => (
              <th
                key={idx}
                className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider"
              >
                {header.label}
              </th>
            ))}
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100"></th>
          </tr>
        </thead>
        <tbody>
          {items && items.slice && items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
            .map((item, idx) => (
              <tr key={idx}>
                {headers.map((header, idx) => (
                  <td
                  key={idx}
                  className="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                  >
                    {header.type === "CSVtoJSON" ? (
                      <button
                        className="btn btn-blue"
                        onClick={() => {
                          try{
                            setCurrentJSONData(JSON.parse(item[header.key]));  // supondo que o item[header.key] contém o JSON
                            setShowJSONModal(true);
                          } catch(e){
                            alert("Error")
                          }
                        }}
                      >
                        Show JSON
                      </button>
                    ) : header.type === "link" ? (
                      <Link  href={`${header.href}?id=${item.id}`}>
                        <button className="btn btn-blue">
                          {header.buttonValue}
                        </button>
                      </Link>
                    ) : (
                      item[header.key]
                    )}
                  </td>
                ))}
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  {permissions.includes('PUT') && (
                    <button
                      onClick={() => {
                        setCurrentItem(item);
                        setShowModal(true);
                      }}
                      className="px-2 py-1 bg-gray-400 text-white rounded mr-2"
                    >
                      Edit
                    </button>
                  )}
                  {permissions.includes('DELETE') && (
                    <button
                      onClick={() => {
                        setItemToDelete(item);
                        setShowDeleteModal(true);
                      }}
                      className="px-2 py-1 bg-red-400 text-white rounded mr-2"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <div className="mt-4">
        <button
          className="px-4 py-2 border rounded-l text-gray-600"
          onClick={previousPage}
        >
          Previous
        </button>
        <span className="px-4 py-2 border-t border-b text-gray-600">
          {currentPage}
        </span>
        <button
          className="px-4 py-2 border rounded-r text-gray-600"
          onClick={nextPage}
        >
          Next
        </button>
      </div>
      {renderModal()}
      {renderDeleteModal()}
      {renderJSONModal()}
    </>
  );
}
