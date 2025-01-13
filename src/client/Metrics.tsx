import React,{useEffect,useState} from "react"
import MetricsChart from "./MetricsChart"
import { useAppSelector } from "./hooks"
import { datePickerToolbarClasses, DateRangeIcon } from "@mui/x-date-pickers";
import { Navigate,useLocation } from "react-router-dom";


interface dateObj{
  startTime:Date;
  endTime:Date;
}


const Metrics = () =>{
  const location = useLocation();
  const {project} = location.state || ''; 

  if(project==='') return <Navigate to='/'/>;

  const user = useAppSelector(state=>state.user);

  const [memUseReponse,setMemUseResponse] = useState<any>();
  const [cpuReponse,setCpuResponse] = useState<any>();
  const [diskWriteReponse,setDiskWriteResponse] = useState<any>();
  const [diskReadReponse,setDiskReadResponse] = useState<any>();
  const [networkEgressReponse,setNetworkEgressResponse] = useState<any>();
  useEffect(()=>{},[memUseReponse])
  const [loading,setLoading] = useState<boolean>(true);
  const [dateSelected,setDateSelected] = useState<boolean>(false);
  const [dateObj,setDateObj] = useState<dateObj>({ startTime: new Date(),
    endTime: new Date()});

    const formatDateForInput = (date: Date) => {
      const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
      return offsetDate.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:MM"
    };

  const handleStartTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDateObj({
      ...dateObj,
      startTime: new Date(event.target.value) 
    });
  };

  // Handler for updating the end time
  const handleEndTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDateObj({
      ...dateObj,
      endTime: new Date(event.target.value)
    });
  };
  useEffect(()=>{},[loading,dateSelected]);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent the default form submission behavior
    if(new Date(dateObj.startTime) < new Date(dateObj.endTime)){

      setLoading(true);
      setDateSelected(true);

      console.log('in useEffect');

      // Assuming this is where you'd make your fetch call
      const formattedStartTime = dateObj.startTime.toISOString();
      const formattedEndTime = dateObj.endTime.toISOString();

      console.log(`Fetching metrics between ${formattedStartTime} and ${formattedEndTime}`);

      // Example fetch call using the date range
      try {
        const response = await fetch(`/api/projects/get-metrics/${project}/${formattedStartTime}/${formattedEndTime}`).then(data=>data.json());
        
        // Assume the response contains separate fields for each metric
        const { memoryUsage, cpuUsage, diskWrite, diskRead, networkEgress } = response;

        console.log(cpuUsage);

        setMemUseResponse(memoryUsage);
        setCpuResponse(cpuUsage);
        setDiskWriteResponse(diskWrite);
        setDiskReadResponse(diskRead);
        setNetworkEgressResponse(networkEgress);
        // Once all are done, set loading to false
        setLoading(false);
        // Handle the response data as needed
      } catch (error) {
        console.error('Error fetching metrics:', error);
      }
    }else{
      return alert('please select a start time that is before the end time');
    }
  };

  return (
    <div className="h-[calc(100vh-7rem)] overflow-y-auto scrollbar-hide">
      <form onSubmit={handleSubmit} className="bg-dark-gray p-6 rounded-lg max-w-lg mx-auto mt-10">
        <h2 className="text-center text-lg font-semibold text-blue-text mb-6">Select Time Range For Metrics</h2>
        
        <div className="mb-4">
          <label htmlFor="start" className="block text-sub-text mb-2">Start Time:</label>
          <input
            type="datetime-local"
            id="start"
            className="w-full p-2 border border-custom-blue rounded-md focus:outline-none focus:ring-2 focus:ring-custom-blue"
            value={formatDateForInput(dateObj.startTime)} // Format for datetime-local input
            onChange={handleStartTimeChange}
          />
        </div>
  
        <div className="mb-4">
          <label htmlFor="end" className="block text-sub-text mb-2">End Time:</label>
          <input
            type="datetime-local"
            id="end"
            className="w-full p-2 border border-custom-blue rounded-md focus:outline-none focus:ring-2 focus:ring-custom-blue"
            value={formatDateForInput(dateObj.endTime)}
            onChange={handleEndTimeChange}
            max={formatDateForInput(new Date())}
          />
        </div>
  
        <button type="submit" className="w-full text-lg p-2 bg-custom-blue text-white rounded-md hover:bg-blue-700 transition-all">
          Get Metrics
        </button>
      </form>
  
      {loading && dateSelected && (
        <h2 className="text-center text-lg text-sub-text mt-6">
          Loading... (this may take up to 5 minutes based on the time frame)
        </h2>
      )}
  
      {!loading && dateSelected && (
        <div className="mt-10 bg-dark-gray p-6 rounded-lg pb-8 scrollbar-hide">
          <h1 className="text-sub-text text-center text-3xl font-semibold mb-6">Metrics Dashboard</h1>
  
          <div className="space-y-8">
            <MetricsChart timeSeries={memUseReponse || []} type="memory" />
            <MetricsChart timeSeries={cpuReponse || []} type="cpu" />
            <MetricsChart timeSeries={diskWriteReponse || []} type="diskWrite" />
            <MetricsChart timeSeries={diskReadReponse || []} type="diskRead" />
            <MetricsChart timeSeries={networkEgressReponse || []} type="networkEgress" />
          </div>
        </div>
      )}
    </div>
  );
  
};

export default Metrics;
