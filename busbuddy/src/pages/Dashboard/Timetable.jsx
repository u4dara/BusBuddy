import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';

function TimeTable() {

  const [isTurntableSectionOpen, setTurntableSectionOpen] = useState(false); // state for view timetable section

  const [isAddTurnForCity1ModalOpen, setAddTurnForCity1ModalOpen] = useState(false); //state for add turn for city table's modal
  const [isEditTurnForCity1ModalOpen, setEditTurnForCity1ModalOpen] = useState(false); //state for edit turn for city1 table'smodal
  const [isAddTurnForCity2ModalOpen, setAddTurnForCity2ModalOpen] = useState(false); //state for add turn for city2 table'smodal
  const [isEditTurnForCity2ModalOpen, setEditTurnForCity2ModalOpen] = useState(false); //state for edit turn for city2 table'smodal


  const [viewRouteList, setViewRouteList] = useState([]); // Correct initialization as an array
/*  const [addRoute, setAddRoute] = useState({
    id: null,
    name: '',
    routeFrom: '',
    routeTo: ''
  });*/

  useEffect(() => {
    loadRouteList();
  }, []);

  // Fetch route list from API
  const loadRouteList = async () => {
    try {
      const result = await axios.get('http://localhost:8081/api/schemas');
      console.log(result.data);
      setViewRouteList(result.data);
    } catch (error) {
      console.error('Error fetching all routes data hmm:', error);
    }
  }; 


  const [selectedRouteName, setSelectedRouteName] = useState([]); // For loading schemaMap id for cruds for loadFareStageList parameters
  const [selectedTurntableId, setSelectedTurntableId] = useState(null); //to load turntable by id to edit textboxes
  const [viewTurntableList, setViewTurntableList] = useState([]); // For loading id-filtered turntable data
  const [viewIncomingTurntableList, setViewIncomingTurntableList] = useState([]); // For loading incoming-filtered turntable data
  const [viewOutgoingTurntableList, setViewOutgoingTurntableList] = useState([]); // For loading outgoing-filtered turntable data
  
  // Triggered when the view button is clicked
  const handleTurntableLoading = (currRouteName, currRouteId) => {
    setSelectedRouteId(currRouteId); // Update selected route ID for filtering turntables
    loadTurntableList(currRouteId);
    setTurntableSectionOpen(true);
  };
  
  // Fetches turntable list and filters data based on the routeId
  const loadTurntableList = async (routeId) => {
    console.log('Loading loadTurntableList with Route ID: ' + routeId); // For testing
    try {
      const result = await axios.get('http://localhost:8081/api/turns');
      console.log(result.data); // For testing
  
      // Filter data based on schemaMap.id (the routeId)
      const filteredData = result.data.filter((item) => item.schemaMap.id === routeId);
      console.log(filteredData); // For testing filtered data
      setViewTurntableList(filteredData); // Update the state with filtered data
  
      // Filter incoming and outgoing data based on "type" (correctly accessing "type" directly from item)
      const filteredIncomingData = filteredData.filter((item) => item.type === 'return');
      setViewIncomingTurntableList(filteredIncomingData);
      
      const filteredOutgoingData = filteredData.filter((item) => item.type === 'going');
      setViewOutgoingTurntableList(filteredOutgoingData);
  
      console.log("Incoming Data:");
      console.log(filteredIncomingData);
      
      console.log("Outgoing Data:");
      console.log(filteredOutgoingData);
  
    } catch (error) {
      console.error('Error fetching turntable data: ', error);
    }
  };

  //to provide routeId in SchemaMap for add operations()
  const [selectedRouteId, setSelectedRouteId] = useState(null);

  //useState for addTableIncoming inputs
  const [addTurnTableIncoming, setAddTurntableIncoming] = useState({
    id: null,
    turnNo: '',
    origin: '',
    departure: '',
    info: '',
    type: '',
    schemaMap: {
        id: null,   //selectedRouteId in useState is needed here(assigned when saving)
        name: null,
        routeFrom: null,
        routeTo: null
    },
    schemaMapName: null
  });

  //useState for addTableOutgoing inputs
  const [addTurnTableOutgoing, setAddTurntableOutgoing] = useState({
    id: null,
    turnNo: '',
    origin: '',
    departure: '',
    info: '',
    type: '',
    schemaMap: {
        id: null,   //selectedRouteId in useState is needed here(assigned when saving)
        name: null,
        routeFrom: null,
        routeTo: null
    },
    schemaMapName: null
  });
 //useState for editTableIncoming inputs
  const [editTurntableIncoming, setEditTurntableIncoming] = useState({
    id: null,
    turnNo: '',
    origin: '',
    departure: '',
    info: '',
    type: '',
    schemaMap: {
        id: null, //a val is needed(to be assigned in api edit method)
        name: null,
        routeFrom: null,
        routeTo: null
    },
    schemaMapName: null
  });
   //useState for editTableOutgoing inputs
   const [editTurntableOutgoing, setEditTurntableOutgoing] = useState({
    id: null,
    turnNo: '',
    origin: '',
    departure: '',
    info: '',
    type: '',
    schemaMap: {
        id: null, //a val is needed(to be assigned in api edit method)
        name: null,
        routeFrom: null,
        routeTo: null
    },
    schemaMapName: null
  });


  // Add a new turntableIncoming
  const addTurnTableIncomings = async () => {
    try {
      // Update schemaMap id with selectedRouteId
      const newTurntableIncoming = { 
        ...addTurnTableIncoming, 
        schemaMap: { id: selectedRouteId },  // Assign schemaMap id
        type: "return"                      // Assign type as "return"
      };
      console.log("data with fk");
      console.log(newTurntableIncoming);
      await axios.post('http://localhost:8081/api/turns', newTurntableIncoming);
      setAddTurnForCity1ModalOpen(false);
      loadTurntableList(selectedRouteId); // Reload turn after addition
      handleClearInfo();
    } catch (error) {
      console.error('Error adding turnTableIncoming: ', error);
    }
  };

    // Add a new turntableIncoming
  const addTurnTableOutgoings = async () => {
    try {
      // Update schemaMap id with selectedRouteId
      const newTurntableOutgoing = { 
        ...addTurnTableOutgoing, 
        schemaMap: { id: selectedRouteId },  // Assign schemaMap id
        type: "going"                      // Assign type as "going"
      };
      console.log("data with fk");
      console.log(newTurntableOutgoing);
      await axios.post('http://localhost:8081/api/turns', newTurntableOutgoing);
      setAddTurnForCity2ModalOpen(false);
      loadTurntableList(selectedRouteId); // Reload turn after addition
      handleClearInfo();
    } catch (error) {
      console.error('Error adding turnTableOutgoing: ', error);
    }
  };


  // Loading turntableIncoming data into edit modal's textboxes when table row edit is clicked
  const loadEditTurntableIncomings = async (turntableId) => {
    try {
      const result = await axios.get(`http://localhost:8081/api/turns/${turntableId}`);
      console.log(result.data);
      setEditTurntableIncoming(result.data);
      setSelectedTurntableId(turntableId);
      setEditTurnForCity1ModalOpen(true);
    } catch (error) {
      console.error('Error loading turntable data incomings for edit:', error);
    }
  };

  // Loading turntableOutgoing data into edit modal's textboxes when table row edit is clicked
  const loadEditTurntableOutgoings = async (turntableId) => {
    try {
      const result = await axios.get(`http://localhost:8081/api/turns/${turntableId}`);
      console.log(result.data);
      setEditTurntableOutgoing(result.data);
      setSelectedTurntableId(turntableId);
      setEditTurnForCity2ModalOpen(true);
    } catch (error) {
      console.error('Error loading turntable data outgoings for edit:', error);
    }
  };

      //updating the finilazed edit incomingturntbl data via the api
    const editTurntableIncomings = async (e) => {
      e.preventDefault();
      try {

      // Update schemaMap id with selectedRouteId
      const newTurntableIncoming = { 
        ...editTurntableIncoming, 
        schemaMap: { id: selectedRouteId },  // Assign schemaMap id
        type: "return"                      // Assign type as "return"
      };
      console.log("data with fk");
      console.log(newTurntableIncoming);
      await axios.put(`http://localhost:8081/api/turns/${selectedTurntableId}`, newTurntableIncoming);
        setEditTurnForCity1ModalOpen(false);
        loadTurntableList(selectedRouteId); // Reload fare stages after editing
      } catch (error) {
        console.error('Error updating price:', error);
      }
    };

      //updating the finilazed edit outgoingturntbl data via the api
      const editTurntableOutgoings = async (e) => {
        e.preventDefault();
        try {
  
        // Update schemaMap id with selectedRouteId
        const newTurntableOutgoing = { 
          ...editTurntableOutgoing, 
          schemaMap: { id: selectedRouteId },  // Assign schemaMap id
          type: "return"                      // Assign type as "return"
        };
        console.log("data with fk");
        console.log(newTurntableOutgoing);
        await axios.put(`http://localhost:8081/api/turns/${selectedTurntableId}`, newTurntableOutgoing);
          setEditTurnForCity2ModalOpen(false);
          loadTurntableList(selectedRouteId); // Reload fare stages after editing
        } catch (error) {
          console.error('Error updating price:', error);
        }
      };

      const deleteTurntableIncomings = async (turntableId) => {
        try {
          console.log("turntableincoming Deletion target: "+turntableId);
          await axios.delete(`http://localhost:8081/api/turns/${turntableId}`);
          loadTurntableList(selectedRouteId); // Reload fare stages after deleting
        } catch (error) {
          console.error('Error deleting incomingturntable:', error);
        }
      };

      const deleteTurntableOutgoings = async (turntableId) => {
        try {
          console.log("turntableoutgoing Deletion target: "+turntableId);
          await axios.delete(`http://localhost:8081/api/turns/${turntableId}`);
          loadTurntableList(selectedRouteId); // Reload fare stages after deleting
        } catch (error) {
          console.error('Error deleting incomingturntable:', error);
        }
      };



  // Handler for add route info form changes
  const handleAddTurntableIncomingInputChange = (e) => {
    console.log("handleinputchange triggered");
    const { name, value} = e.target;
    setAddTurntableIncoming({ ...addTurnTableIncoming, [name]: value });
  };
  // Handler for add route info form changes
  const handleAddTurntableOutgoingInputChange = (e) => {
    console.log("handleinputchange triggered");
    const { name, value} = e.target;
    setAddTurntableOutgoing({ ...addTurnTableOutgoing, [name]: value });
  };
  
  // Handler for edit route info form changes
  const handleEditTurntableIncomingInputChange = (e) => {
    console.log("edit incoming inputchange tirggered");
    const { name, value} = e.target;
    setEditTurntableIncoming({ ...editTurntableIncoming, [name]: value });
  };
  // Handler for edit route info form changes
  const handleEditTurntableOutgoingInputChange = (e) => {
    console.log("edit outgoing inputchange tirggered");
    const { name, value} = e.target;
    setEditTurntableOutgoing({ ...editTurntableOutgoing, [name]: value });
  };
  

  const handleClearInfo = () => {        // Handler to clear route info form for both add & edit in both tables
    setAddTurntableIncoming({
      id: '',
      turnNo: '',
      origin: '',
      departure: '',
      info: '',
      type: '',
      schemaMap: {
          id: '',
          name: '',
          routeFrom: '',
          routeTo: ''
      },
      schemaMapName: ''
    });
    setAddTurntableOutgoing({
      id: '',
      turnNo: '',
      origin: '',
      departure: '',
      info: '',
      type: '',
      schemaMap: {
          id: '',
          name: '',
          routeFrom: '',
          routeTo: ''
      },
      schemaMapName: ''
    });

    setEditTurntableIncoming({
      id: '',
      turnNo: '',
      origin: '',
      departure: '',
      info: '',
      type: '',
      schemaMap: {
          id: '',
          name: '',
          routeFrom: '',
          routeTo: ''
      },
      schemaMapName: ''
    });
    setEditTurntableOutgoing({
      id: '',
      turnNo: '',
      origin: '',
      departure: '',
      info: '',
      type: '',
      schemaMap: {
          id: '',
          name: '',
          routeFrom: '',
          routeTo: ''
      },
      schemaMapName: ''
    });
  };














  const [turnForCity1Info, setTurnForCity1Info] = useState({     // turn info state for city one table
    id: 1,
    turnNo: 2,
    departureTime: "9.00am",
    arrivalTime: "10.30pm"
  });

  const [turnForCity2Info, setTurnForCity2Info] = useState({     // turn info state for city one table
    id: 2,
    turnNo: 5,
    departureTime: "4.00am",
    arrivalTime: "4.40pm"
  });


    // Handler for turn for city 1 info form changes
    const handleTurnForCity2InputChange = (e) => {
      const { name, value} = e.target;
      console.log("is working");
      setTurnForCity2Info({ ...turnForCity2Info, [name]: value });
    };
    
  
    const handleUpdateTurnForCity2Info = () => {         // Handler to save updated info
      console.log('Updated turn for city 2 info:', turnForCity2Info);
      setEditTurnForCity2ModalOpen(false); // Close modal after update
    };
  
    const handleTurnForCity2ClearInfo = () => {        // Handler to clear (add & edit) turn for city one table info form
      console.log("clear handle event triggered");
      setTurnForCity2Info({
        id: 0,
        turnNo: 0,
        departureTime: "-",
        arrivalTime: "-"
      });
    };

  return (
    <>
      {isTurntableSectionOpen ? (
        <>
        <div>
          <div className="bg-white/[.20] p-8 ml-12 rounded-lg">
      <h1 className="text-2xl font-bold">Timetable for Colombo-Kandy-Express(001)</h1>
            {/* <div className="p-4 w-full bg-transparent flex justify-center">
              <label htmlFor="table-search" className="sr-only">Search</label>
              <div className="relative mt-1 text-center">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-500"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                    >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                      />
                  </svg>
                </div>
                <input
                  type="text"
                  id="table-search"
                  className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search for items"
                  />
              </div>
            </div> */}



            <div className="grid grid-cols-2 gap-4 relative container mx-auto overflow-x-auto sm:rounded-lg content-start	">
              {/*Table for City 01*/}

              <div className="flex flex-row justify-center items-center gap-20 mb-2 col-span-2"> {/* Add turn for city 1 Button */}
                <button 
                  type="button" 
                  className="mt-3 h-10 px-4 py-2 m-1 text-white transition-colors duration-300 transform bg-[#FF9119]/80 rounded-md border border-orange-400 hover:text-white hover:border-yellow-500 focus:outline-none"
                  onClick={() => setAddTurnForCity1ModalOpen(true)} //opens add modal for route description
                  >
                  <i className="fi fi-rs-price-add mr-6"></i>
                  Add Turn for city o1
                </button>

                <button 
                  type="button" 
                  className="mt-3 h-10 px-4 py-2 m-1 text-white transition-colors duration-300 transform bg-[#FF9119]/80 rounded-md border border-orange-400 hover:text-white hover:border-yellow-500 focus:outline-none"
                  onClick={() => setAddTurnForCity2ModalOpen(true)} //opens add modal for route description
                  >
                  <i className="fi fi-rs-price-add mr-6"></i>
                  Add Turn for city o2
                </button>
              </div>

              <div>
                <table className="w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-white/[.3] rounded-lg">
                    <tr>
                      <th scope="col" className="p-4">
                        <div className="flex items-center">
                          <label htmlFor="checkbox-all-search" className="sr-only">checkbox</label>
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3">Turn No</th>
                      <th scope="col" className="px-6 py-3">From City 01</th>
                      <th scope="col" className="px-6 py-3">To City 02</th>
                      <th scope="col" className="px-6 py-3">Edit</th>
                      <th scope="col" className="px-6 py-3">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/*City 01 Table Data */}
                    {viewIncomingTurntableList.map((outList) => (
                      <tr key={outList.id} className="bg-white/[.6] border-b hover:bg-gray-50">
                        <td className="w-4 p-4">
                          <div className="flex items-center">
                            <label htmlFor={`checkbox-table-search-${outList.id}`} className="sr-only">checkbox</label>
                          </div>
                        </td>
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                          {outList.turnNo}
                        </th>
                        <td className="px-6 py-4">{outList.origin}</td>
                        <td className="px-6 py-4">{outList.departure}</td>
                        <td className="px-6 py-4">
                          <div className="text-center">
                            <i className="fi fi-rs-edit hover:text-blue-600 hover:font-bold hover:rounded-full w-10"
                              onClick={() => loadEditTurntableIncomings(outList.id)}
                            ></i>
                          </div>
                        </td>
                        <td>
                          <div className="text-center">
                            <i className="fi fi-rs-trash hover:text-red-600 hover:font-bold hover:rounded-full w-10"
                              onClick={() => deleteTurntableIncomings(outList.id)}
                            ></i>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Table for city 02*/}
              <div>
                <table className="w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-white/[.3] rounded-lg">
                    <tr>
                      <th scope="col" className="p-4">
                        <div className="flex items-center">
                          <label htmlFor="checkbox-all-search" className="sr-only">checkbox</label>
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3">Turn No</th>
                      <th scope="col" className="px-6 py-3">From City 02</th>
                      <th scope="col" className="px-6 py-3">To City 01</th>
                      <th scope="col" className="px-6 py-3">Edit</th>
                      <th scope="col" className="px-6 py-3">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* City 02 Table Data */}
                    {viewOutgoingTurntableList.map((inList) => (
                      <tr key={inList.id} className="bg-white/[.6] border-b hover:bg-gray-50">
                        <td className="w-4 p-4">
                          <div className="flex items-center">
                            <label htmlFor={`checkbox-table-search-${inList.id}`} className="sr-only">checkbox</label>
                          </div>
                        </td>
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                          {inList.turnNo}
                        </th>
                        <td className="px-6 py-4">{inList.origin}</td>
                        <td className="px-6 py-4">{inList.departure}</td>
                        <td className="px-6 py-4">
                          <div className="text-center">
                            <i className="fi fi-rs-edit hover:text-blue-600 hover:font-bold hover:rounded-full w-10"
                            onClick={() => loadEditTurntableOutgoings(inList.id)}></i>
                          </div>
                        </td>
                        <td>
                          <div className="text-center">
                            <i className="fi fi-rs-trash hover:text-red-600 hover:font-bold hover:rounded-full w-10"
                              onClick={() => deleteTurntableOutgoings(inList.id)}
                            ></i>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="text-center col-span-2">
                <button
                  type="button"
                  className="mt-3 h-10 px-4 py-2 m-1 text-white transition-colors duration-300 transform bg-[#FF9119]/80 rounded-md border border-orange-400 hover:text-white hover:border-transparent focus:border-transparent"
                  onClick={() => {setTurntableSectionOpen(false);}}
                  >
                  Back to Routes
                </button>
              </div>
            </div>
          </div>
          </div>
        </>


      ) : (


      <div className="bg-white/[.20] p-8 ml-12 rounded-lg">      
    <div className="flex flex-row justify-around mx-32 -mb-8">
  
  <div className="container flex flex-col items-start"> {/* Align items to the left */}
    <h1 className="text-2xl font-bold mb-1">Timetable</h1> {/* Adjusted margin */}
    <p className="text-gray-700">Manage your timetable with this easy interface</p>
  </div>

  {/* <div className="flex flex-row justify-center items-center"> 
    <button 
      type="button" 
      className="mt-3 h-10 px-4 py-2 m-1 text-white transition-colors duration-300 transform bg-[#FF9119]/80 rounded-md border border-orange-400 hover:text-white hover:border-yellow-500 focus:outline-none"
      
    >
      <i className="fi fi-rs-price-add mr-2"></i> 
      Add Price
    </button>
  </div> */}
</div>


    <div className="flex flex-row justify-around">
    {/* <div className="p-4 bg-transparent flex justify-center"> 
          <label htmlFor="table-search" className="sr-only">
            Search
          </label>
          <div className="relative mt-1 text-center ">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 "
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
                >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
              </svg>
            </div>
            <input
              type="text"
              id="table-search"
              className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 "
              placeholder="Search for items"
              />
          </div>
    </div> */}

      {/* <!--add new route button is unnecessary for this tab-->
    <div className="flex flex-row justify-center items-center">
      <button 
        type="button" 
        className="mt-3 h-10 px-4 py-2 m-1 text-white transition-colors duration-300 transform bg-[#FF9119]/80 rounded-md border border-orange-400 hover:text-white hover:border-yellow-500 focus:outline-none"
        onClick={() => setAddRouteModalOpen(true)}
        >
        <i className="fi fi-rs-price-add mr-6"></i>
        Add Route
      </button>
    </div>
        */}

  </div>


  

    <div className="flex gap-10 relative container mx-auto overflow-x-auto rounded-lg  sm:rounded-lg justify-around">{/*rendering route table*/}
    <table className="text-sm text-left text-gray-500 rounded-lg w-2/3">
        <thead className="text-xs text-gray-700 uppercase bg-white/[.3] rounded-lg ">
          <tr>
            <th scope="col" className="p-4">
              <div className="flex items-center">

                <label htmlFor="checkbox-all-search" className="sr-only">
                  checkbox
                </label>
              </div>
            </th>
            <th scope="col" className="px-6 py-3">
              Route No
            </th>
            <th scope="col" className="px-6 py-3">
              Description
            </th>
            <th scope="col" className="px-6 py-3 w-30 text-center">
              View Timetable
            </th>
            {/*
            <th scope="col" className="px-6 py-3 w-6">
              Edit
            </th>
            <th scope="col" className="px-6 py-3 w-6">
              Delete
            </th>
            */}

          </tr>
        </thead>
        <tbody >
          {viewRouteList.map((route) => (
            <tr
            key={route.id}
            className="bg-white/[.6] border-b  hover:bg-gray-50 "
            >
              <td className="w-4 p-4">
                <div className="flex items-center">

                  <label
                    htmlFor={`checkbox-table-search-${route.id}`}
                    className="sr-only"
                    >
                    checkbox
                  </label>
                </div>
              </td>
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
                >
                {route.name}
              </th>
              <td className="px-6 py-4">{route.routeFrom}-{route.routeTo}</td>
              <td className="px-6 py-4">
                <div className="text-center">
                  <i className="fi fi-rs-eye hover:text-orange-600 hover:font-bold hover:rounded-full w-10" 
                     //onClick={() => setTurntableSectionOpen(true)}
                     onClick={() =>{ 
                      console.log(route.id);
                      handleTurntableLoading(route.name, route.id);
                     }}
                  >
                  </i>
                </div>
              </td>
              {/*
              <td className="px-6 py-4">
                <div className="text-center">
                  <i className="fi fi-rs-edit hover:text-blue-600 hover:font-bold hover:rounded-full w-10" 
                     onClick={() => setEditRouteModalOpen(true)}>
                  </i>
                </div>
              </td>
              <td>
                <div className="text-center">
                  <i className="fi fi-rs-trash hover:text-red-600 hover:font-bold hover:rounded-full w-10"></i>
                </div>
              </td>
              */}

            </tr>
          ))}
        </tbody>
    </table>
    </div>

  </div>
    )}

      {/*add turn for city 01 incomingTurntable modal*/}
      <Modal 
      isOpen={isAddTurnForCity1ModalOpen}
      onRequestClose={() => setAddTurnForCity1ModalOpen(false)}
      contentLabel="Add New Turns for Incoming"
      className="flex  rounded w-3/4 mx-auto mt-20 flex-col justify-center items-center"
    >
    <h2 className="text-xl font-semibold m-6">Add New Turns for Incoming</h2>
    <div className="bg-black/[.40] p-8 w-1/3 rounded-md">
      <form action="">
      <label className="block text-white mb-1">Turn Number</label>
          <input
            type="text"
            name="turnNo"
            className="w-full p-2 rounded-md border-none focus:outline-none"
            placeholder="Enter turn number"
            value={addTurnTableIncoming.turnNo}
            onChange={handleAddTurntableIncomingInputChange}
            />
          <label className="block text-white mb-1">Origin Time</label>
          <input
            type="text"
            name="origin"
            className="w-full p-2 rounded-md border-none focus:outline-none"
            placeholder="Enter arrival time"
            value={addTurnTableIncoming.origin}
            onChange={handleAddTurntableIncomingInputChange}
            />
          <label className="block text-white mb-1">Departure Time</label>
          <input
            type="text"
            name="departure"
            className="w-full p-2 rounded-md border-none focus:outline-none"
            placeholder="Enter departure time"
            value={addTurnTableIncoming.departure}
            onChange={handleAddTurntableIncomingInputChange}
            />
            <div className="flex flex-row text-center m-6">
            <button 
              type="button" 
              className="mt-3 h-10 px-4 py-2 m-1 text-white transition-colors duration-300 transform bg-[#FF9119]/80 rounded-md border border-orange-400 hover:text-white hover:border-yellow-500 focus:outline-none"
              onClick={addTurnTableIncomings}
              >
                {/*<i className="fi fi-rs-user-add mr-6"></i>*/}
                Add Turn
          </button>
          <button 
              type="button" 
              className="mt-3 h-10 px-4 py-2 m-1 text-gray-600 transition-colors duration-300 transform bg-white rounded-md border border-gray-400 hover:text-black hover:border-gray-600 focus:outline-none"
              onClick={handleClearInfo}
              >
                Clear All
          </button>
          <button
              type="button"
              className="mt-3 h-10 px-4 py-2 m-1 text-white transition-colors duration-300 transform bg-red-400/80 rounded-md border border-red-400 hover:text-white hover:border-red-500 focus:outline-none"
              onClick={() =>{ 
                setAddTurnForCity1ModalOpen(false);
                handleClearInfo();
              }}
          >
              Cancel
          </button>
            </div>
      </form>
    </div>
    </Modal>

     {/*edit turn for city 1 table modal*/}
    <Modal 
      isOpen={isEditTurnForCity1ModalOpen}
      onRequestClose={() => setEditTurnForCity1ModalOpen(false)}
      contentLabel="Edit Turns for Incoming"
      className="flex rounded w-3/4 mx-auto mt-20 flex-col justify-center items-center"
    >
      <h2 className="text-xl font-semibold m-6">Edit Turns for Incoming</h2>
      <div className="bg-black/[.40] p-8 w-1/3 rounded-md">
        <form action="">
          <label className="block text-white mb-1">Turn Number</label>
          <input
            type="text"
            name="turnNo"  
            className="w-full p-2 rounded-md border-none focus:outline-none"
            placeholder="Enter turn number"
            value={editTurntableIncoming.turnNo}
            onChange={handleEditTurntableIncomingInputChange}
          />

          <label className="block text-white mb-1">Arrival Time</label>
          <input
            type="text"
            name="origin"  
            className="w-full p-2 rounded-md border-none focus:outline-none"
            placeholder="Enter arrival time"
            value={editTurntableIncoming.origin}
            onChange={handleEditTurntableIncomingInputChange}
          />

          <label className="block text-white mb-1">Departure Time</label>
          <input
            type="text"
            name="departure"
            className="w-full p-2 rounded-md border-none focus:outline-none"
            placeholder="Enter departure time"
            value={editTurntableIncoming.departure}
            onChange={handleEditTurntableIncomingInputChange}
          />
          {/*buttons */}
          <div className="flex flex-row text-center m-6">
            <button 
              type="button" 
              className="mt-3 h-10 px-4 py-2 m-1 text-white transition-colors duration-300 transform bg-[#FF9119]/80 rounded-md border border-orange-400 hover:text-white hover:border-yellow-500 focus:outline-none"
              onClick={editTurntableIncomings}
            >
              <i className="fi fi-rs-user-add mr-6"></i>
              Edit Turn
            </button>
            <button 
              type="button" 
              className="mt-3 h-10 px-4 py-2 m-1 text-gray-600 transition-colors duration-300 transform bg-white rounded-md border border-gray-400 hover:text-black hover:border-gray-600 focus:outline-none"
              onClick={handleClearInfo}
            >
              <i className="fi fi-rs-user-add mr-6"></i>
              Clear All
            </button>
            <button
              type="button"
              className="mt-3 h-10 px-4 py-2 m-1 text-white transition-colors duration-300 transform bg-red-400/80 rounded-md border border-red-400 hover:text-white hover:border-red-500 focus:outline-none"
              onClick={() => {
                setEditTurnForCity1ModalOpen(false);
                handleClearInfo();
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Modal>


    
      {/*------add turn for city 02 table modal*/}
      <Modal 
      isOpen={isAddTurnForCity2ModalOpen}
      onRequestClose={() => setAddTurnForCity2ModalOpen(false)}
      contentLabel="Add New Turns For Outgoing"
      className="flex  rounded w-3/4 mx-auto mt-20 flex-col justify-center items-center"
    >
    <h2 className="text-xl font-semibold m-6">Add New Turns for Outgoing</h2>
    <div className="bg-black/[.40] p-8 w-1/3 rounded-md">
      <form action="">
      <label className="block text-white mb-1">Turn Number</label>
          <input
            type="text"
            name="turnNo"
            className="w-full p-2 rounded-md border-none focus:outline-none"
            placeholder="Enter turn number"
            value={addTurnTableOutgoing.turnNo}
            onChange={handleAddTurntableOutgoingInputChange}
            />
          <label className="block text-white mb-1">Arrival Time</label>
          <input
            type="text"
            name="origin"
            className="w-full p-2 rounded-md border-none focus:outline-none"
            placeholder="Enter arrival time"
            value={addTurnTableOutgoing.origin}
            onChange={handleAddTurntableOutgoingInputChange}
            />
          <label className="block text-white mb-1">Departure Time</label>
          <input
            type="text"
            name="departure"
            className="w-full p-2 rounded-md border-none focus:outline-none"
            placeholder="Enter departure time"
            value={addTurnTableOutgoing.departure}
            onChange={handleAddTurntableOutgoingInputChange}
            />
            <div className="flex flex-row text-center m-6">
            <button 
              type="button" 
              className="mt-3 h-10 px-4 py-2 m-1 text-white transition-colors duration-300 transform bg-[#FF9119]/80 rounded-md border border-orange-400 hover:text-white hover:border-yellow-500 focus:outline-none"
              onClick={addTurnTableOutgoings}
              >
                {/*<i className="fi fi-rs-user-add mr-6"></i>*/}
                Add Turn
          </button>
          <button 
              type="button" 
              className="mt-3 h-10 px-4 py-2 m-1 text-gray-600 transition-colors duration-300 transform bg-white rounded-md border border-gray-400 hover:text-black hover:border-gray-600 focus:outline-none"
              onClick={handleClearInfo}
              >
                Clear All
          </button>
          <button
              type="button"
              className="mt-3 h-10 px-4 py-2 m-1 text-white transition-colors duration-300 transform bg-red-400/80 rounded-md border border-red-400 hover:text-white hover:border-red-500 focus:outline-none"
              onClick={() => {
                setAddTurnForCity2ModalOpen(false);
                handleClearInfo();
              }}
          >
              Cancel
          </button>
            </div>
      </form>
    </div>
    </Modal>

         {/*edit turn for city 2 table modal*/}
         <Modal 
      isOpen={isEditTurnForCity2ModalOpen}
      onRequestClose={() => setEditTurnForCity2ModalOpen(false)}
      contentLabel="Edit Turns for Incoming"
      className="flex rounded w-3/4 mx-auto mt-20 flex-col justify-center items-center"
    >
      <h2 className="text-xl font-semibold m-6">Edit Turns for Incoming</h2>
      <div className="bg-black/[.40] p-8 w-1/3 rounded-md">
        <form action="">
          <label className="block text-white mb-1">Turn Number</label>
          <input
            type="text"
            name="turnNo"  
            className="w-full p-2 rounded-md border-none focus:outline-none"
            placeholder="Enter turn number"
            value={editTurntableOutgoing.turnNo}
            onChange={handleEditTurntableOutgoingInputChange}
          />

          <label className="block text-white mb-1">Arrival Time</label>
          <input
            type="text"
            name="origin"  
            className="w-full p-2 rounded-md border-none focus:outline-none"
            placeholder="Enter arrival time"
            value={editTurntableOutgoing.origin}
            onChange={handleEditTurntableOutgoingInputChange}
          />

          <label className="block text-white mb-1">Departure Time</label>
          <input
            type="text"
            name="departure"
            className="w-full p-2 rounded-md border-none focus:outline-none"
            placeholder="Enter departure time"
            value={editTurntableOutgoing.departure}
            onChange={handleEditTurntableOutgoingInputChange}
          />
          {/*buttons */}
          <div className="flex flex-row text-center m-6">
            <button 
              type="button" 
              className="mt-3 h-10 px-4 py-2 m-1 text-white transition-colors duration-300 transform bg-[#FF9119]/80 rounded-md border border-orange-400 hover:text-white hover:border-yellow-500 focus:outline-none"
              onClick={editTurntableOutgoings}
            >
              <i className="fi fi-rs-user-add mr-6"></i>
              Edit Turn
            </button>
            <button 
              type="button" 
              className="mt-3 h-10 px-4 py-2 m-1 text-gray-600 transition-colors duration-300 transform bg-white rounded-md border border-gray-400 hover:text-black hover:border-gray-600 focus:outline-none"
              onClick={handleClearInfo}
            >
              <i className="fi fi-rs-user-add mr-6"></i>
              Clear All
            </button>
            <button
            type="button"
            className="mt-3 h-10 px-4 py-2 m-1 text-white transition-colors duration-300 transform bg-red-400/80 rounded-md border border-red-400 hover:text-white hover:border-red-500 focus:outline-none"
            onClick={() => {
              setEditTurnForCity2ModalOpen(false);
              handleClearInfo();
            }}
          >
            Cancel
          </button>
          </div>
        </form>
      </div>
    </Modal>


    </>
  );
}

export default TimeTable;
