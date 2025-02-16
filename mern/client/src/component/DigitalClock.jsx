import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, RefreshCcw, Bell } from "lucide-react";

const DigitalClock = () => {
  const [time, setTime] = useState(new Date());
  const [alarmTime, setAlarmTime] = useState(
    localStorage.getItem("alarmTime") || ""
  );
  const [alarmSet, setAlarmSet] = useState(false);
  const [stopwatch, setStopwatch] = useState(
    parseInt(localStorage.getItem("stopwatch")) || 0
  );
  const [isStopwatchRunning, setIsStopwatchRunning] = useState(false);
  const [timerHours, setTimerHours] = useState(
    parseInt(localStorage.getItem("timerHours")) || 0
  );
  const [timerMinutes, setTimerMinutes] = useState(
    parseInt(localStorage.getItem("timerMinutes")) || 0
  );
  const [timerSeconds, setTimerSeconds] = useState(
    parseInt(localStorage.getItem("timerSeconds")) || 0
  );
  const [timerRunning, setTimerRunning] = useState(false);

  const intervalRef = useRef(null);
  const timerRef = useRef(null);
  const stopwatchRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (alarmSet) {
      const now = new Date();
      const alarmDate = new Date(now.toDateString() + " " + alarmTime);

      if (now >= alarmDate) {
        alert("⏰ Alarm Ringing!");
        setAlarmSet(false);
      }
    }
  }, [time, alarmSet, alarmTime]);

  useEffect(() => {
    localStorage.setItem("alarmTime", alarmTime);
  }, [alarmTime]);

  useEffect(() => {
    localStorage.setItem("stopwatch", stopwatch.toString());
  }, [stopwatch]);

  useEffect(() => {
    localStorage.setItem("timerHours", timerHours.toString());
    localStorage.setItem("timerMinutes", timerMinutes.toString());
    localStorage.setItem("timerSeconds", timerSeconds.toString());
  }, [timerHours, timerMinutes, timerSeconds]);

  const startStopwatch = () => {
    if (!isStopwatchRunning) {
      stopwatchRef.current = setInterval(() => {
        setStopwatch((prev) => prev + 1);
      }, 1000);
      setIsStopwatchRunning(true);
    }
  };

  const stopStopwatch = () => {
    clearInterval(stopwatchRef.current);
    setIsStopwatchRunning(false);
  };

  const resetStopwatch = () => {
    clearInterval(stopwatchRef.current);
    setStopwatch(0);
    setIsStopwatchRunning(false);
  };

  const startTimer = () => {
    if (!timerRunning) {
      timerRef.current = setInterval(() => {
        setTimerSeconds((prevSeconds) => {
          if (prevSeconds === 0) {
            if (timerMinutes === 0 && timerHours === 0) {
              clearInterval(timerRef.current);
              setTimerRunning(false);
              alert("⏳ Timer finished!");
              return 0;
            }
            setTimerMinutes((prevMinutes) => {
              if (prevMinutes === 0) {
                setTimerHours((prevHours) =>
                  prevHours > 0 ? prevHours - 1 : 0
                );
                return 59;
              }
              return prevMinutes - 1;
            });
            return 59;
          }
          return prevSeconds - 1;
        });
      }, 1000);
      setTimerRunning(true);
    }
  };

  const stopTimer = () => {
    clearInterval(timerRef.current);
    setTimerRunning(false);
  };

  const resetTimer = () => {
    clearInterval(timerRef.current);
    setTimerHours(0);
    setTimerMinutes(0);
    setTimerSeconds(0);
    setTimerRunning(false);
  };

  return (
    <div className="flex flex-col items-center p-10 space-y-10 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white min-h-screen font-sans">
      {/* Clock */}
      <div className="p-8 bg-gray-900/50 backdrop-blur-md text-6xl font-extrabold rounded-3xl shadow-2xl text-center w-96 border border-gray-600/30">
        {time.toLocaleTimeString("en-US", { hour12: true })}
      </div>

      {/* Alarm */}
      <div className="flex space-x-4 items-center">
        <input
          type="text"
          placeholder="HH:MM AM/PM"
          className="p-3 bg-gray-700/50 backdrop-blur-md rounded-lg focus:outline-none focus:ring-4 focus:ring-green-400/50 shadow-lg transition-all"
          value={alarmTime}
          onChange={(e) => setAlarmTime(e.target.value)}
        />
        <button
          onClick={() => setAlarmSet(true)}
          className="px-6 py-3 bg-green-500/80 backdrop-blur-md rounded-2xl shadow-lg flex items-center hover:bg-green-600/80 transition-all"
        >
          <Bell className="mr-2" /> Set Alarm
        </button>
      </div>

      {/* Stopwatch */}
      <div className="p-6 bg-gray-900/50 backdrop-blur-md rounded-3xl shadow-2xl w-96 text-center border border-gray-700/30">
        <p className="text-2xl font-semibold mb-3">
          Stopwatch: {Math.floor(stopwatch / 3600)}h{" "}
          {Math.floor((stopwatch % 3600) / 60)}m {stopwatch % 60}s
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={startStopwatch}
            className="px-6 py-3 bg-blue-500/80 backdrop-blur-md rounded-2xl shadow-lg hover:bg-blue-600/80 transition-all"
          >
            <Play />
          </button>
          <button
            onClick={stopStopwatch}
            className="px-6 py-3 bg-red-500/80 backdrop-blur-md rounded-2xl shadow-lg hover:bg-red-600/80 transition-all"
          >
            <Pause />
          </button>
          <button
            onClick={resetStopwatch}
            className="px-6 py-3 bg-gray-500/80 backdrop-blur-md rounded-2xl shadow-lg hover:bg-gray-600/80 transition-all"
          >
            <RefreshCcw />
          </button>
        </div>
      </div>

      {/* Timer */}
      <div className="p-6 bg-gray-900/50 backdrop-blur-md rounded-3xl shadow-2xl w-96 text-center border border-gray-700/30">
        <p className="text-2xl font-semibold mb-3">Timer:</p>
        <div className="flex justify-center space-x-3 mb-3">
          <input
            type="number"
            min="0"
            className="w-20 p-3 bg-gray-700/50 backdrop-blur-md rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all"
            placeholder="H"
            value={timerHours}
            onChange={(e) => setTimerHours(parseInt(e.target.value) || 0)}
          />
          <input
            type="number"
            min="0"
            className="w-20 p-3 bg-gray-700/50 backdrop-blur-md rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all"
            placeholder="M"
            value={timerMinutes}
            onChange={(e) => setTimerMinutes(parseInt(e.target.value) || 0)}
          />
          <input
            type="number"
            min="0"
            className="w-20 p-3 bg-gray-700/50 backdrop-blur-md rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all"
            placeholder="S"
            value={timerSeconds}
            onChange={(e) => setTimerSeconds(parseInt(e.target.value) || 0)}
          />
        </div>
        <div className="flex justify-center space-x-4">
          <button
            onClick={startTimer}
            className="px-6 py-3 bg-blue-500/80 backdrop-blur-md rounded-2xl shadow-lg hover:bg-blue-600/80 transition-all"
          >
            <Play />
          </button>
          <button
            onClick={stopTimer}
            className="px-6 py-3 bg-red-500/80 backdrop-blur-md rounded-2xl shadow-lg hover:bg-red-600/80 transition-all"
          >
            <Pause />
          </button>
          <button
            onClick={resetTimer}
            className="px-6 py-3 bg-gray-500/80 backdrop-blur-md rounded-2xl shadow-lg hover:bg-gray-600/80 transition-all"
          >
            <RefreshCcw />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DigitalClock;
