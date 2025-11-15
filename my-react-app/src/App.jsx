import { useState, useEffect } from 'react';
import './App.css';
import logoPic from '/src/assets/d-logo.jpg';
import djzamijainfo from './info.json';

function App() {
  const [prayerTime, setPrayerTime] = useState('');
  //This value allows for a variable prayerTime to be set and for a function to set that prayerTime, initially it is set to null
  //This compnent is rerender when you make the call to setPrayerTime

  //useEffect checks for anything that needed to be done after render that might have took some time
  //In this scenerio it is changed based on the API call and if it successful or not
  useEffect(() => {
    //Creating a function fetchData that gets passed in another function
    //Async waits for the api to be called and parsed and then runs after
    const fetchData = async () => {
      //Fetch makes a promise that it will try to connect to this api
      fetch(
        'https://api.aladhan.com/v1/timingsByCity?city=North%20Kansas%20City&country=United%20States&method=2'
      )
        //after call has been made we get a response (arbitrary value can be named anything)
        .then((response) => {
          //If that response isn't valid we through an exception error
          if (!response.ok) {
            throw new Error(`Error status: ${response.status}`);
          }
          //we then return a parsed Json from the API to tell us what happened
          return response.json();
        })
        //After parsing, we get the actual data object and handle it here
        .then((data) => {
          console.log(data);
          setPrayerTime(data);
        })
        .catch((error) => {
          console.error('There was a problem with the fetch operation:', error); // Handle any errors
        });
    };
    fetchData();

    const interval = setInterval(() => {});
  }, []);

  //function to check for current prayer

  let currentTime = new Date();
  let currentPrayer = [];

  //Make sure you have an exception check on Object.entries because it won't work
  if (prayerTime?.data?.timings) {
    //Adding up the totals of times into minutes to make date comparison easier
    const currentTotal = currentTime.getHours() * 60 + currentTime.getMinutes();
    //for loop similar to enumerate in python where you get a keyvalue pair
    //gets key name and value time in the object we stood up from the json
    for (const [name, time] of Object.entries(prayerTime.data.timings)) {
      if (name in djzamijainfo.prayerNames) {
        console.log(name + 'log');
        const [hour, minute] = time.split(':').map(Number);
        const prayerTotal = hour * 60 + minute;

        if (currentTotal > prayerTotal) {
          currentPrayer = name;
        }
        continue;
      }
    }
  }

  //Note please remember to put question marks just incase those things are ready to be displayed
  //Reason why that check also looks different is because it needs to be in a terinary operator
  //You cant have an if statement there in JSX
  return (
    <div className="min-h-screen w-full text-center bg-white">
      <div
        className="w-full h-48 bg-cover bg-center"
        style={{ backgroundImage: `url(${logoPic})` }}
      ></div>
      {/* Wrapper for side-by-side layout */}
      <div className="flex gap-8 pl-4 pr-4">
        {/* Prayer times column */}
        <div className="prayer-times flex-1 text-3xl pr-4 pl-4">
          <div className="pt-8">
            <div className="current-information flex flex-col items-center mb-6 text-black">
              <div className="bg-emerald-500 px-6 py-3 rounded-2xl shadow-lg inline-block font-semibold mt-4">
                Current Prayer | {currentPrayer}
              </div>
              <div className="day-information grid grid-cols-[1fr_auto_1fr] w-full items-center pt-8">
                {/* Time */}
                <div className="flex flex-col items-center">
                  <span className="text-6xl font-bold text-emerald-700 tracking-wide tabular-nums">
                    {currentTime.getHours()}:
                    {currentTime.getMinutes().toString().padStart(2, '0')}
                  </span>
                  <span className="text-sm uppercase text-gray-500 mt-1">
                    Local Time
                  </span>
                </div>

                {/* Divider */}
                <div className="w-px h-16 bg-emerald-700/60 mx-6"></div>

                {/* Date */}
                <div className="flex flex-col items-center">
                  <span className="text-5xl font-semibold text-gray-700 tabular-nums">
                    {prayerTime?.data?.date?.gregorian?.date}
                  </span>
                  <span className="text-sm uppercase text-gray-500 mt-1">
                    Date
                  </span>
                </div>
              </div>
            </div>

            <ul className="w-full flex flex-col text-black gap-16">
              {prayerTime?.data &&
                Object.entries(prayerTime.data.timings).map(
                  ([name, time]) =>
                    name in djzamijainfo.prayerNames && (
                      <li key={name} className="w-full relative mb-6">
                        <div className="grid grid-cols-3 items-center text-center">
                          {/* Left column */}
                          <span className="font-medium text-4xl text-left">
                            {name}
                          </span>

                          {/* Center column (always centered) */}
                          <span className="text-emerald-400 font-semibold text-4xl tabular-nums">
                            {time}
                          </span>

                          {/* Right column */}
                          <span className="font-arabic text-3xl text-right">
                            {djzamijainfo.prayerNames[name]}
                          </span>
                        </div>

                        <span
                          className="absolute inset-x-0 bottom-0 h-px
              bg-gradient-to-r
              from-emerald-500/0 via-emerald-500/70 to-emerald-500/0"
                        />
                      </li>
                    )
                )}
            </ul>
          </div>
        </div>

        {/* Important dates column */}
        <div className="important-dates flex-1 p-14">
          <div className="banner font-bold text-3xl mb-4 text-emerald-700">
            Important Dates | Vazni Datumi
          </div>

          {/* visible window */}
          <div className="relative h-184 overflow-hidden rounded-lg shadow-lg bg-emerald-400">
            {/* scrolling content (duplicated for loop) */}
            <div className="animate-scroll-vertical flex flex-col">
              {[
                ...Object.entries(djzamijainfo.importantDates),
                ...Object.entries(djzamijainfo.importantDates),
              ].map(([date, desc], i) => (
                <div key={i} className="p-2 text-3xl text-white font-medium">
                  {date} — {desc}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
